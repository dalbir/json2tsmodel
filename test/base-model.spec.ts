// import { BaseModel, Cast, ReadOnly, HasOne, HasMany, PK } from './index';

// class Human extends BaseModel {

//     @ReadOnly
//     @PK @Cast() public id;

//     @Cast('n') public name: string;
//     @Cast(v => +v)
//     public age: number;

//     @ReadOnly
//     @Cast('age', (v) => +v >= 18 )
//     public adult: boolean;


//     @HasMany(Human) @Cast() public children: Human[];
//     @HasOne(Human) @Cast() public wife: Human;

// }

// class Empty extends BaseModel { }

// const json = {
//     id: '01',
//     n: 'Name',
//     age: '20',
//     wife: {
//         n: 'W'
//     },
//     children: [{
//         id: 'c1',
//         n: 'Child 1',
//         age: 10
//     },         {
//         id: 'c2',
//         n: 'Child 2'
//     }]
// };

// describe('Model Factory',  () => {

//     let human: Human;

//     beforeAll(() => {
//         human = new Human();
//     });

//     it('should have correct functions exposed', () => {
//         expect(human.cast).toBeFunction();
//         expect(human.toJson).toBeFunction();
//     });

//     it('should not brake if no properties specified', () => {
//         const empty = new Empty();
//         const res = empty.cast({}); empty.toJson();
//         expect(res).toEqual(empty);
//     });

//     describe('cast method', () => {

//         beforeAll(() => {
//             human.cast(json);
//         });

//         it('should return primary key properly', () => {
//             expect(human.getPK()).toBe('01');
//         });

//         it('should cast json to data model correctly', () => {
//             expect(human.id).toBe('01');
//             expect(human.name).toBe('Name');
//             expect(human.age).toBe(20);
//         });

//         it('should use convert function correctly', () => {
//             expect(human.adult).toBeTrue();
//         });

//         it('should define relations correctly', () => {
//             expect(human.wife).toBeDefined();
//             expect(human.wife.name).toBe('W');
//             expect(human.children.length).toBe(2);
//         });

//         describe('toJson method', () => {

//             let resultJson;
//             beforeAll(() => {
//                 resultJson = human.toJson();
//             });

//             it('should expose correct data', () => {
//                 expect(resultJson.n).toBe('Name');
//             });

//             it('should skip readonly properties', () => {
//                 expect(resultJson.id).toBeUndefined();
//             });

//             it('should skip undefined properties', () => {
//                 expect(resultJson.children[1].age).toBeUndefined();
//             });

//         });
//     });


// });
