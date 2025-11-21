import React from "react";
import { PropsWithChildren, createContext } from "react";

import { useCreateCommentDiscloresureCore } from "./comment/useCreateCommentDiscloresure";
import { useUpdateAvatarDisclosureCore } from "./profile/useUpdateAvatarDisclosure";

export interface DiscloresuresContextType {
  useCreateCommentDisclosure: ReturnType<
    typeof useCreateCommentDiscloresureCore
  >;
  useUpdateAvatarDisclosure: ReturnType<typeof useUpdateAvatarDisclosureCore>;
}

export const DiscloresuresContext =
  createContext<DiscloresuresContextType | null>(null);

export const DiscloresuresProvider = ({ children }: PropsWithChildren) => {
  const useCreateCommentDisclosure = useCreateCommentDiscloresureCore();
  const useUpdateAvatarDisclosure = useUpdateAvatarDisclosureCore();
  return (
    <>
      <DiscloresuresContext.Provider
        value={{
          useCreateCommentDisclosure,
          useUpdateAvatarDisclosure,
        }}
      >
        {children}
      </DiscloresuresContext.Provider>
    </>
  );
};
