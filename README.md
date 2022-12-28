
# searchClassRoom 🏫
 
## why? 🤬
because debil i was doused
with water and I was looking for
which class he was from

## how its working ⁉️
It presses all the lesson plans
and selects the appropriate data
and then saves and searches for what you need.
It is updated after every change in the lesson plan.
As it is enough to restart the program.
I do it after every shift.

## versions 🆕

`1.0.0` ~ old press little data 

`2.0.0` ~ new press more data if you need
## API Reference ⚒️

#### get class name

```http
  GET /nameClass?searchClass=${searchClass}&searchDay=${searchDay}&lesson=${lesson}
```

#### get class in classroom

```http
  GET /class?searchClass=${searchClass}&searchDay=${searchDay}
```

### API returns 

```json
  "nameLesson": name lesson,
  "numberLesson": numebr of lesson,
  "classRoom": number of room,
  "class": class name,
  "day":0-4,
  "link": short link to lesson plan,
  "teacher": teacher id,
  "teacherLink": short link to lesson  teacher plan
```

## my finder 🔍

https://finder.kacpep.dev/

## my API 😶

https://api.kacpep.dev/


## author 😎

- [@kacpep](https://www.github.com/kacpep) 😇

