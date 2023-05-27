import express from 'express'
import { graphqlHTTP } from 'express-graphql';
import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const app = express();

const AuthorType = new GraphQLObjectType({
    name: "author",
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        books: {
            type: GraphQLList(bookType),
            resolve: (author) => (books.filter(book => book.authorId === author.id))
        }
    })
})

const bookType = new GraphQLObjectType({
    name: 'book',
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        authorId: { type: GraphQLInt },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
})

const rootQueryType = new GraphQLObjectType({
    name: 'rootQuery',
    fields: () => ({
        books: {
            type: GraphQLList(bookType),
            resolve: () => books
        },
        authors: {
            type: GraphQLList(AuthorType),
            resolve: () => authors
        },
        book: {
            type: bookType,
            args: {
                id: { type: GraphQLInt },
            },
            resolve: (parent, args) => (books.find(book => book.id === args.id))
        }
    })
})

const schema = new GraphQLSchema({
    query: rootQueryType
})

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema
}))

app.listen(8000, () => {
    console.log('Server is running on port 8000');
})