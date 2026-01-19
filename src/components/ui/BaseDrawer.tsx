import { Drawer } from "antd";
import React from "react";

interface BaseDrawerProps {
  open: boolean;
  title?: string;
  width?: number;
  onClose: () => void;
  children: React.ReactNode;
}

const BaseDrawer: React.FC<BaseDrawerProps> = ({
  open,
  title,
  width = 520,
  onClose,
  children,
}) => {
  return (
    <Drawer
      title={title}
      open={open}
      size={width}
      onClose={onClose}
      destroyOnHidden
      maskClosable={false}
      className="box_drawer"
      styles={{ header: { display: "none" } }}
    >
      {children}
    </Drawer>
  );
};

export default BaseDrawer;
