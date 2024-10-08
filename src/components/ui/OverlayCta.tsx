import { ReactNode, useMemo } from "react";

type Props = {
  data: {
    cb: () => void;
    icon: ReactNode;
    className?: string;
  }[];
  children?: ReactNode;
};

const classes = {
  button:
    "text-[#333] bg-white p-1 rounded-md shadow-lg border hover:border-transparent hover:bg-[#cd1818] hover:text-white hover:scale-[1.05] transition-transform",
  hide: "opacity-0 translate-y-[10px]",
  show: "group-hover:!translate-y-[0] group-hover:!opacity-[1]",
};

export default function OverlayCTA({ data }: Props) {
  const CTA = useMemo(() => {
    return data.map((item, index) => {
      const { cb, icon, className } = item;

      return (
        <button
          key={index}
          onClick={cb}
          className={`${classes.button} ${className ? className : ""}`}
        >
          {icon}
        </button>
      );
    });
  }, [data]);
  return (
    <div
      className={`${classes.hide} ${classes.show} transition-[opacity,transform]  flex absolute bottom-0 h-[40%]  items-center justify-center gap-[12px]`}
    >
      {CTA}
    </div>
  );
}
