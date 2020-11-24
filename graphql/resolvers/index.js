const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Person = require('../../models/Person');
const User = require('../../models/User');

module.exports = {
    persons: async () => {
        try {
            const persons = await Person.find();
            return persons.map(person => {
                return {
                    ...person._doc, 
                    _id: person.id, 
                    name: person.name,
                    surname: person.surname,
                    country: person.country, 
                    birthday: new Date(person.birthday).toISOString()
                }
            })
        } catch (err) {
            throw err;
        }
    },

    newPerson: async args => {
        try {
            const person = new Person({
                name: args.personInput.name,
                surname: args.personInput.surname,
                country: args.personInput.country,
                birthday: new Date(args.personInput.birthday)
            })
            const result = await person.save();
            return {...result._doc, _id: result.id, name: result.name, surname: result.surname, country: result.country, birthday: result.birthday}
        } catch (err) {
            throw err;
        }
    },
    deletePerson: async args => {
        try {
            const person = await Person.findOneAndDelete({_id: args.id})
            return {...person._doc, _id: person.id, name: person.name, surname: person.surname, country: person.country, birthday: person.birthday}
        } catch (err) {
            throw err;
        }
    },
    updatePerson: async args => {
        console.log(args);
        try {
            const doc = await Person.findOne({ _id: args.id });
            doc.overwrite({ name: args.name, surname: args.surname, country: args.country, birthday: args.birthday });
            const result = await doc.save();
            console.log(result._doc);
            return {...result._doc, _id: result._id, name: result.name, surname: result.surname, country: result.country, birthday: result.birthday}
        } catch (err) {
            throw err;
        }
    },
    newUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email })  ;
            if(existingUser){
                throw new Error('User exists already!');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            })

            const result = await user.save();
            return { ...result._doc, password: null, _id: result.id}
        } catch (err) {
            throw err;
        }
    },

    login: async ({email, password}) => {
        const user = await User.findOne({email: email});
        if(!user){
            throw new Error('User does not exist!');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual){
            throw new Error('Password is incorrect!');
        }
        const token = jwt.sign({userId: user.id, email: user.email}, 'secretkey', {
            expiresIn: '1h'
        });
        return { userId: user.id, token: token, tokenExpiration: 1}
    }
}