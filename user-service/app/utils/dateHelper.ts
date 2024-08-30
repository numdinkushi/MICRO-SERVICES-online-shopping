import dayjs from "dayjs";

export const timeDifference = (
    fromDate: string,
    toDate: string,
    type: "d" | "h" | "m"
) => {
    const startDate = dayjs(fromDate);

    return startDate.diff(dayjs(toDate), type, true);
};