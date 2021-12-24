import { ApolloServer, gql} from 'apollo-server';
import bcrypt from 'bcryptjs';

const users = [
    {name: "Tonkla", gender: "Male", id: 0, password:"dump123"},
    {name: "Hime", gender: "Female", id: 1, password:"dump123"},
    {name: "SekHuaKuy", gender: "Male", id: 2, password:"dump123"},
    {name: "Towa", gender: "Female", id: 3, password:"dump123"},
];
const books =[
    {title:"Lord of Knight",userID:3,id:0},
    {title:"NTR Legend",userID:2,id:1},
    {title:"24K",userID:1,id:2},
    {title:"Kimchi Style",userID:0,id:3},
    {title:"Crusader",userID:0,id:4},
];
const locations=[
    {locate:"Yashin",userID:3,id:0},
    {locate:"Zanis",userID:2,id:1},
    {locate:"LosSantos",userID:0,id:2},
    {locate:"ViceCity",userID:1,id:3},
];
//schema
const typeDefs = gql `
    type Query {
        hello: String
        hi: String
        users: [User]
        user(name: String):User
    }
    type User{
        name: String
        gender: String
        id: ID
        password: String
        books:[Book]
        locations:[Location]
    }
    type Book{
        id:ID
        title: String
    }
    type Location{
        locate: String
        id: ID
    }
    type Mutation{
        addUser(name:String, gender:String, id:String):User
        createUser(name:String, password:String):User
        loginUser(name:String, password:String):String
    }
`;

//resolver
const resolvers = {
    Query:{
        hello: (parent, args, context, info)=>{
            return "world";
        },
        hi:(parent, args, context, info)=>{
            return "62022877";
        },
        users:(parent, args, context, info)=>{
            return users;
        },
        user:(parent, args, context, info) =>{
            return users.find(user => user.name === args.name);
        },
    },
    User:{
        books:({id}, args, context, info) =>{
            return books.filter(book=>book.userID==id);
        },
        locations:({id}, args, context, info) =>{
            return locations.filter(location=>location.userID==id);
        },
    },
    Mutation:{
        addUser:(parent, args, context, info)=>{
            const{name, gender,id} = args;

            //add data to database
            users.push({name:name,gender:gender,id:id});
            return {name:name,gender:gender,id:id};
        },
        createUser:(parent,args,context,info)=>{
            const {name,password} = args;
            const hashPassword = bcrypt.hashSync(password,5);

            users.push({name:name, password:hashPassword});
            return {name:name,password:hashPassword};
        },
        loginUser:(parent,args,context,info)=>{
            const user = users.filter(user => user.name === args.name);

            const correct = bcrypt.compareSync(user.password, args.password);
            if(correct)
            {
                return "Correct";
            }
            return "Cyka blyat!, Not correct FOOL!!!";
        },
    }
};

//function apollo-server
const startApolloServer = async (typeDefs, resolvers) =>{
    const server = new ApolloServer({typeDefs, resolvers});
    const {url} = await server.listen();
    console.log(`Server ready at ${url}`);
};

//call function
startApolloServer(typeDefs, resolvers);