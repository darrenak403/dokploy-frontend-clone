import { useContext } from "react";

import { useDisclosure } from "@heroui/react";

import { DiscloresuresContext } from "../DiscloresuresProvider";

export const useUpdateAvatarDisclosureCore = () => {
  return useDisclosure();
};

export const useUpdateAvatarDisclosureSingleton = () => {
  const { useUpdateAvatarDisclosure } = useContext(DiscloresuresContext)!;
  return useUpdateAvatarDisclosure;
};
