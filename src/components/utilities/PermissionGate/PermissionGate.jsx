
import React from "react";
import { PermissionCombinationIdentifier } from "./enum";
import { useSelector } from "react-redux";
import { Tooltip } from "primereact/tooltip";
import { Navigate } from "react-router-dom";

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

export const PermissionGate = (props) => {
  const {
    children,
    actionsAppliedOnChildrenInCaseNoPermission = null,
    redirectToNotAuthorized = null,
    Permissions = [],
    allowIf = PermissionCombinationIdentifier.HAS_ANY,
    tooltipTarget = null,
  } = props;

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

  /* if (!children) return permissionGranted; */

  if (!permissionGranted && !actionsAppliedOnChildrenInCaseNoPermission) {
    if (redirectToNotAuthorized)
      return <Navigate to={redirectToNotAuthorized} />;
    return <></>;
  }

  if (!permissionGranted && actionsAppliedOnChildrenInCaseNoPermission)
    return (
      <>
        {React.cloneElement(children, {
          ...actionsAppliedOnChildrenInCaseNoPermission,
        })}
        {tooltipTarget && (
          <Tooltip
            id="permissiongate-tooltip"
            target={`.${tooltipTarget}`}
            mouseTrack
            mouseTrackLeft={10}
            content="No permissions for this feature"
          />
        )}
      </>
    );

  return <>{children}</>;
};
