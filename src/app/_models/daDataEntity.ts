export interface DaDataClientEntity {
  value: string;
  data: {
    inn: string;
    kpp: string;
    address: {
      unrestricted_value: string;
    };
    name: {
      full_with_opf: string;
      short_with_opf: string;
    };
  };
}

export interface DaDataBankEntity {
  value: string;
  data: {
    bic: string;
    correspondent_account: string;
  };
}
