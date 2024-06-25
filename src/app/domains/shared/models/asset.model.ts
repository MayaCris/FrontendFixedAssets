import { AssetType } from "./asset-type.model";
import { Person } from "./person.model";
import { Location } from "./location.model";

export interface Asset{
    assetIdD: number;
    assetCodeD: string;
    assetNameD: string;
    assetDescriptionD: string;
    typeIdD: number;
    assetTypeDo?: AssetType;
    acquisitionDateD: Date;
    acquisitionValueD: number;
    locationIdD: number;
    locationDo?: Location;
    personIdD: string;
    responsiblePersonDo?: Person;
    checkAsset: boolean;

}

