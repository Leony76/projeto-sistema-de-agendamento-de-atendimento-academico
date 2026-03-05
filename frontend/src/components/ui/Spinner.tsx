import style from './css/Spinner.module.css';

type Props = {
  size?: number;
  color?: string;
  thickness?: number;
};

const Spinner = ({
  size = 24,
  color = '#333',
  thickness = 3
}: Props) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeDasharray="60"
        strokeDashoffset="20"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          dur="1.50s"
          from="0 12 12"
          to="360 12 12"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};

export default Spinner;