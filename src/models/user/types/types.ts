export type RegClientData = {
  name: string;
  password: string;
};

export type RegServerData = {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
};

export type WinnersDataRes = {
  name: string;
  wins: number;
}[];
