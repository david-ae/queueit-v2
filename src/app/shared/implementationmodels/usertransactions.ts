import { UserVO } from 'src/app/domainmodel/valueobjects/userVO';

export abstract class UserTransactions{
    tellerName: UserVO;
    noOfTransWorkedOn: number;
    totalAmount: number;
}