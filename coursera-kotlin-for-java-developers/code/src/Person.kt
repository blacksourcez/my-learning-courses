package week_2

class Person(val name: String, val age: Int)

fun main() {
    val person = Person("Alice", 27)
    print(person.age)
}