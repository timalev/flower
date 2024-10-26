import { Injectable } from '@angular/core';
import { DaDataBankEntity, DaDataClientEntity } from '../../_models/daDataEntity';
import { Bank, Firm } from '../../_models/business-pack/firm';

@Injectable({
  providedIn: 'root',
})
export class DadataToBpConverterService {
  public convertToFirm(entity: DaDataClientEntity): Firm {
    return <Firm>{
      FullName: entity.data.name.full_with_opf,
      ShortName: entity.data.name.short_with_opf,
      Address: entity.data.address.unrestricted_value,
      INN: entity.data.inn,
      KPP: entity.data.kpp,
    };
  }

  public convertToBank(entity: DaDataBankEntity): Bank {
    return <Bank>{
      BIK: entity.data.bic,
      Bank: entity.value,
      CorDep: entity.data.correspondent_account,
    };
  }

  public getAutocompleteBankItem(entity: Firm): DaDataBankEntity {
    return <DaDataBankEntity>{
      value: entity.Bank,
      data: {
        bic: entity.BIK,
        correspondent_account: entity.CorDep,
      },
    };
  }
}
