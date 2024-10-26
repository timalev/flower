import { Injectable } from '@angular/core';
import { GoodsBusinessPack } from '../../_models/business-pack/goods-base';
import { Product } from '../../_models/product';
import { BusinessPackModel } from '../../_models/business-pack/business-pack-model';

@Injectable({
  providedIn: 'root',
})
export class BusinessPackConverterService {
  public convertToBase(goods: BusinessPackModel | Product): GoodsBusinessPack {
    const goodsBP: GoodsBusinessPack = {
      Name: goods.name,
      Price: goods.price,
      NDS: goods.nds,
      NDSMode: goods.ndsMode,
      Volume: goods.volume,
      Note1: goods.note1,
      Note2: goods.note2,
      Pack: goods.pack,
      Coefficient: goods.coefficient,
    };
    if (goods.id) goodsBP.Object = goods.id;
    return goodsBP;
  }

  public convertToProduct(goodsBP: GoodsBusinessPack): BusinessPackModel {
    const goods: BusinessPackModel = {
      name: goodsBP.Name,
      price: goodsBP.Price,
      nds: goodsBP.NDS,
      ndsMode: goodsBP.NDSMode,
      volume: goodsBP.Volume,
      note1: goodsBP.Note1,
      note2: goodsBP.Note2,
      pack: goodsBP.Pack,
      coefficient: goodsBP.Coefficient,
    };
    if (goodsBP.Object) goods.id = goodsBP.Object;
    return goods;
  }
}
