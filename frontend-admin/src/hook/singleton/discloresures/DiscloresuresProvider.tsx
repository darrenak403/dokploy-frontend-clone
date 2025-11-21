import React from "react";
import { PropsWithChildren, createContext } from "react";

import { useCreateUserDiscloresureCore } from "./account/useCreateUserDisclosure";
import { useGetUserByIdDiscloresureCore } from "./account/useGetUserByIdDiscloresure";
import { useUpdateUserDiscloresureCore } from "./account/useUpdateUserDiscloresure";
import { useCreateCommentDiscloresureCore } from "./comment/useCreateCommentDiscloresure";
import { useCreatePatientDiscloresureCore } from "./patient/useCreatePatientDiscloresure";
import { useUpdatePatientDiscloresureCore } from "./patient/useUpdatePatientDiscloresure";
import { useViewPatientDiscloresureCore } from "./patient/useViewPatientDiscloresure";
import { useUpdateAvatarDisclosureCore } from "./profile/useUpdateAvatarDisclosure";
import { useCreateTestOrderDiscloresureCore } from "./test-order/useCreateTestOrderDiscloresure";
import { useUpdateTestOrderDiscloresureCore } from "./test-order/useUpdateTestOrderDiscloresure";
import { useViewTestOrderDiscloresureCore } from "./test-order/useViewTestOrderDiscloresure";

export interface DiscloresuresContextType {
  useCreatePatientDisclosure: ReturnType<
    typeof useCreatePatientDiscloresureCore
  >;
  useUpdatePatientDisclosure: ReturnType<
    typeof useUpdatePatientDiscloresureCore
  >;
  useViewPatientDisclosure: ReturnType<typeof useViewPatientDiscloresureCore>;
  useViewTestOrderDisclosure: ReturnType<
    typeof useViewTestOrderDiscloresureCore
  >;
  useCreateTestOrderDisclosure?: ReturnType<
    typeof useCreateTestOrderDiscloresureCore
  >;
  useUpdateTestOrderDisclosure?: ReturnType<
    typeof useUpdateTestOrderDiscloresureCore
  >;
  useCreateCommentDisclosure: ReturnType<
    typeof useCreateCommentDiscloresureCore
  >;
  useCreateUserDisclosure: ReturnType<typeof useCreateUserDiscloresureCore>;
  useGetUserByIdDisclosure: ReturnType<typeof useGetUserByIdDiscloresureCore>;
  useUpdateUserDiscloresure: ReturnType<typeof useUpdateUserDiscloresureCore>;
  useUpdateAvatarDisclosure: ReturnType<typeof useUpdateAvatarDisclosureCore>;
}

export const DiscloresuresContext =
  createContext<DiscloresuresContextType | null>(null);

export const DiscloresuresProvider = ({ children }: PropsWithChildren) => {
  const useCreatePatientDisclosure = useCreatePatientDiscloresureCore();
  const useUpdatePatientDisclosure = useUpdatePatientDiscloresureCore();
  const useViewPatientDisclosure = useViewPatientDiscloresureCore();
  const useViewTestOrderDisclosure = useViewTestOrderDiscloresureCore();
  const useCreateTestOrderDisclosure = useCreateTestOrderDiscloresureCore();
  const useUpdateTestOrderDisclosure = useUpdateTestOrderDiscloresureCore();
  const useCreateCommentDisclosure = useCreateCommentDiscloresureCore();
  const useCreateUserDisclosure = useCreateUserDiscloresureCore();
  const useGetUserByIdDisclosure = useGetUserByIdDiscloresureCore();
  const useUpdateUserDiscloresure = useUpdateUserDiscloresureCore();
  const useUpdateAvatarDisclosure = useUpdateAvatarDisclosureCore();
  return (
    <>
      <DiscloresuresContext.Provider
        value={{
          useCreatePatientDisclosure,
          useUpdatePatientDisclosure,
          useViewPatientDisclosure,
          useViewTestOrderDisclosure,
          useCreateTestOrderDisclosure,
          useUpdateTestOrderDisclosure,
          useCreateCommentDisclosure,
          useCreateUserDisclosure,
          useGetUserByIdDisclosure,
          useUpdateUserDiscloresure,
          useUpdateAvatarDisclosure,
        }}
      >
        {children}
      </DiscloresuresContext.Provider>
    </>
  );
};
