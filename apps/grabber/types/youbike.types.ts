export type ParkingInfo = {
  retCode: number;
  retMsg: string;
  retVal: {
    data: {
      station_no: string;
      parking_spaces: number;
      available_spaces: number;
      available_spaces_detail: {
        yb2: number | undefined;
        eyb: number | undefined;
      };
      empty_spaces: number;
      forbidden_spaces: number;
      available_spaces_level: number;
      lat: string;
      lng: string;
      status: number;
    }[];

    per_page: number;
    current_page: number;
    total_page: number;
    total: number;
  };
};
