import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ValidationResult {
  isValid: boolean;
  correctedHobby?: string;
  suggestions?: string[];
  reasoning?: string;
}

interface SmartHobbyInputProps {
  onHobbyValidated: (hobby: string) => void;
  popularHobbies: string[];
}

export function SmartHobbyInput({ onHobbyValidated, popularHobbies }: SmartHobbyInputProps) {
  const [input, setInput] = useState('');
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const validateHobby = useCallback(async (hobby: string) => {
    if (!hobby.trim()) {
      setValidation(null);
      return;
    }

    setIsValidating(true);
    try {
      const response = await fetch('/api/validate-hobby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hobby: hobby.trim() })
      });

      if (response.ok) {
        const result = await response.json();
        setValidation(result);
        
        // If valid and corrected, show the correction to user
        if (result.isValid && result.correctedHobby) {
          setInput(result.correctedHobby);
        }
      } else {
        console.error('Validation failed:', response.statusText);
        setValidation(null);
      }
    } catch (error) {
      console.error('Error validating hobby:', error);
      setValidation(null);
    } finally {
      setIsValidating(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setShowSuggestions(false);
    
    // Debounced validation with min length guard to avoid silly guesses
    const timeoutId = setTimeout(() => {
      if (value.trim().length >= 3) {
        validateHobby(value);
      } else {
        setValidation(null);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleSubmit = () => {
    if (validation?.isValid) {
      const finalHobby = validation.correctedHobby || input;
      onHobbyValidated(finalHobby);
    } else if (input.trim()) {
      // Force validation on submit
      validateHobby(input.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
    validateHobby(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const getValidationIcon = () => {
    if (isValidating) return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    if (validation?.isValid) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (validation && !validation.isValid) return <AlertCircle className="h-4 w-4 text-red-500" />;
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="What hobby would you like to learn? (e.g., guitar, cooking, drawing)"
          className="pr-10"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {getValidationIcon()}
        </div>
      </div>

      {/* Validation Messages */}
      {validation && !validation.isValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            I'm not sure "{input}" is a hobby I can help with.
            {validation.reasoning && <span className="block text-sm mt-1">{validation.reasoning}</span>}
          </AlertDescription>
        </Alert>
      )}

      {validation?.correctedHobby && validation.isValid && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Great! I corrected "{input}" to "{validation.correctedHobby}" for you.
          </AlertDescription>
        </Alert>
      )}

      {/* Suggestions */}
      {validation?.suggestions && validation.suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Try these popular hobbies instead:</p>
          <div className="flex flex-wrap gap-2">
            {validation.suggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-sm"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Popular hobbies when no input */}
      {!input && !showSuggestions && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Popular hobbies to get started:</p>
          <div className="flex flex-wrap gap-2">
            {popularHobbies.slice(0, 6).map((hobby) => (
              <Button
                key={hobby}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(hobby)}
                className="text-sm"
              >
                {hobby}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Submit button */}
      <Button
        onClick={handleSubmit}
        disabled={!validation?.isValid && !input.trim()}
        className="w-full"
      >
        {validation?.isValid ? 'Continue with this hobby' : 'Check hobby'}
      </Button>
    </div>
  );
}