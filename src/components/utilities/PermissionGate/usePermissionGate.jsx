
import React from "react";
import { PermissionCombinationIdentifier } from "./enum";
import { useSelector } from "react-redux";

const getUserPermissions = (user) => {
  if (!user) return [];
  return [`Per-${user.role}`];
};

const getConcatenatedProvidedPermissions = (Permissions) => {
  const perArray = [];
  Permissions.forEach((per) => {
    perArray.push(`Per-${per}`);
  });
  return perArray;
};

export const usePermissionGate = (Permissions = [], allowIf = PermissionCombinationIdentifier.HAS_ANY) => {
  const user = useSelector((state) => state.auth.user);

  const userPermissions = getUserPermissions(user);
  let permissionGranted = false;

  const concatenatedProvidedPermissions =
    getConcatenatedProvidedPermissions(Permissions);

  switch (allowIf) {
    case PermissionCombinationIdentifier.HAS_ANY:
      permissionGranted = concatenatedProvidedPermissions.some((pp) =>
        userPermissions.includes(pp)
      );
      break;
    case PermissionCombinationIdentifier.HAS_ALL:
      permissionGranted = concatenatedProvidedPermissions.every((pp) =>
        userPermissions.includes(pp)
      );
      break;
    case PermissionCombinationIdentifier.DOES_NOT_HAVE_ANY:
      permissionGranted = concatenatedProvidedPermissions.some(
        (pp) => !userPermissions.includes(pp)
      );
      break;
    case PermissionCombinationIdentifier.DOES_NOT_HAVE_ALL:
      permissionGranted = concatenatedProvidedPermissions.every(
        (pp) => !userPermissions.includes(pp)
      );
      break;
    default:
      break;
  }

  return [permissionGranted];
};
