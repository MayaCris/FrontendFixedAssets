import { Asset } from "./asset.model";

export interface Depreciation{
    depreciationIdD: number;
    assetIdD: number;
    depreciationDateD: string;
    depreciationValueD: number;
    fixedAssetDo?: Asset;

}