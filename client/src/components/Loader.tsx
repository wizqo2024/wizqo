import React from 'react';

export default function Loader() {
  return (
    <div style={{ display: 'inline-block' }}>
      <div className="wizqo-loader">
        <span />
        <span />
        <span />
        <span />
      </div>
      <style>
        {`
        .wizqo-loader {
          position: relative;
          border-radius: 50%;
          height: 96px;
          width: 96px;
          animation: wizqo-rotate 1.2s linear infinite;
          background-color: #9b59b6;
          background-image: linear-gradient(#9b59b6, #84cdfa, #5ad1cd);
        }

        .wizqo-loader span {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          height: 100%;
          width: 100%;
          background-color: #9b59b6;
          background-image: linear-gradient(#9b59b6, #84cdfa, #5ad1cd);
        }

        .wizqo-loader span:nth-of-type(1) { filter: blur(5px); }
        .wizqo-loader span:nth-of-type(2) { filter: blur(10px); }
        .wizqo-loader span:nth-of-type(3) { filter: blur(25px); }
        .wizqo-loader span:nth-of-type(4) { filter: blur(50px); }

        .wizqo-loader::after {
          content: "";
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          bottom: 10px;
          background-color: #fff;
          border: solid 5px #ffffff;
          border-radius: 50%;
        }

        @keyframes wizqo-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        `}
      </style>
    </div>
  );
}

