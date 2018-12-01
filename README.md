# JSON to Data Models

[![Travis](https://img.shields.io/travis/ddramone/tsjson.svg)](https://travis-ci.org/ddramone/tsjson)
[![Coveralls](https://img.shields.io/coveralls/ddramone/tsjson.svg)](https://coveralls.io/github/ddramone/tsjson)

The easiest and cleanest way to cast json to data models using typescript decorators.

### Sneak peek:


```ts
class Human extends BaseModel {

  @Cast()
  username: string;

  @Cast('first_name')
  name: string;

  @Cast('age', v => v>18)
  isAdult: boolean;

} 

const myself = new Human().cast({
  "username": "ddramone"
  "first_name": "Ika"
  "age": 26
});

myself.username // "ddramone"
myself.name // "Ika"
myself.isAdult // true

```
*And there are way more...*

## Why to use

* If you want to have real model classes instead of interfaces
* If manually deserializing json data to class properties feels bad and looks ugly for you
* If you don't want to update every part of your code if json structure changes from your api
* If you want to have flexible way of casting json data down to data models by appling accumilator functions to them

### Install

`npm i tsjson`

### Define Model

The very first step to use library is to define model by extending it from the `BaseModel`.

```ts
import { BaseModel } from 'tsjson';

class MyModel extends BaseModel {
}

const instance = new MyModel()

```

### Using **@Cast** decorator

Idea of using @Cast decorator it is to map expected json structure to model properties.

Followig example defines `id` property that conforms `uuid` from  JSON.

```ts
class User extends BaseModel {
 @Cast('uuid') id: string;
}

new u = new User().cast(
    { uuid: 'u_1' }
)
```

Using @Cast decorator is flexible. 
There are multiple ways to use it.

* `@Cast('uuid') id: string;`
    With **alias** string as an only argument when you want your class property to conform json structure
* `@Cast() id: string;`
    Without any arguments when **alias** of the property name matches json structure.
* `@Cast(v => +v) age: number;`
    With *transformer function* as an only argument when you want to apply function to value while casting data to model instance. 
    *example above ensures that the type of the `age` is always number*
    Transformer function takes 2 arguments:
    * `value` that is being casted based on defined alias.
    * `raw` whole data that is being casted.
* `@Cast('age', v => v>=18) isAdult: boolean;`
    Combination of both **alias** and **transformer function**


### Using **@HasMany** and **@HasOne** decorators

Id your model contains properties that are seperate models themselves, than using `@HasMany` and `@HasOne` will make your life easier when you want to cast whole object in one go.

Both of docerators take sub-model class reference as an argument.

example:

```ts
class Location extends BaseModel {
    @Cast()
    country: string;
    
    @Cast()
    city: string;
}

class User extends BaseModel {
    @Cast()
    name: string;
    
    @HasOne(Location)
    @Cast() 
    address: Location;
}

const user = new User();
user.cast({
    name: 'Ika',
    address: {
        city: 'Batumi',
        country: 'Georgia',
    }
})
```

Obviously type of `user.address` will be `Location` and it will contain both `country` and `city` values.

`@HasMany` decorator does the same, but for arrays

Example:
```ts
class Book {
    @Cast() isbn: string;
}

class Author extends BaseModel {
    
    @Cast() name: string;
    
    ＠HasMany(Book)
    ＠Cast() books: Book[];
 }
 
 const author = new Author().cast({
    name: 'Philip K. Dick'
    books: [
        { isbn: '9780345404473' }
        { isbn: '9780679740667' }
    ]
 })
```

... have fun 🖖
