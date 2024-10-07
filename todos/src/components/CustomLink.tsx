import React from "react";
import { useRoute, Link } from "wouter";

interface Props {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const CustomLink = (props: Props) => {
  const [isActive] = useRoute(props.href);
  const activeObject = {
    color: "#030821",
  };
  return (
    <Link {...props}>
      <span style={isActive ? activeObject : {}}>{props.children}</span>
    </Link>
  );
};

export default CustomLink;
