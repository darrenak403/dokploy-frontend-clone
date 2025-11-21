export const getFlagColor = (flag: string) => {
  switch (flag) {
    case "H":
      return "danger";
    case "L":
      return "warning";
    case "N":
      return "success";
    default:
      return "default";
  }
};

export const getFlagLabel = (flag: string) => {
  switch (flag) {
    case "H":
      return "High";
    case "L":
      return "Low";
    case "N":
      return "Normal";
    default:
      return flag;
  }
};

export const getFlagIcon = (flag: string) => {
  switch (flag) {
    case "H":
      return "mdi:trending-up";
    case "L":
      return "mdi:trending-down";
    case "N":
      return "mdi:minus";
    default:
      return null;
  }
};
