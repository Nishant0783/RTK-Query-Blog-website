/* ************************************************************************
=> ADAPTERS: They are utilities provided by Redux toolkit to help manage normalized state, especially when dealing with collections of data. They provide set of functions that make it easier to manipulate arrays of items in a normalized way, which is particularly useful for efficiently updating and accessing data in the Redux store. The main features of adapter are:
        i) Normalization
        ii) CRUD operations: They provide functions to do basic operations like adding, updating, removing items in a normalized state structure.
        iii) Selectors: Adapters generate selectors that can be used to query the state for specific items or lists of items.

=> NORMALIZED STATE: Here normalization refers to the normalization which we do in database to avoid duplicacy. 'createEnitytAdapters' method creates an adapter which turns the data into normalized state. What it do is, It divides the data in two parts which are named as:   
        i) id: It is an array of all the unique id which our data has.   
        ii) entities: It is the array of objects where each object is actual data which is fetched from API.

=> OPTIMISTIC UPDATES: It refers to a pattern where the application updates the UI immediately after an action is taken, before the server confirms the action.

=> MEMOIZED SELECTORS: It is a special type of selector created using the Reselect library that optimizes performance by caching the result of a selector function. The advantage is that they avoid recomputation of the derived data when the input state hasn't changed thereby, reducing unnecessary calculations.
                                                                            ************************************************************************
*/

/*
1) --------------
This is extendedApiSlice for posts:
    1) We need two methods:
        i) createSelector ->  This method is used to create memoized selectors which uses caching mechanism to optimise data and manage network requests.
        ii) createEntityAdapter -> This is the methd which is used to create adapters which then are used to implement normalized state.
    2) Import the main slice which is 'apiSlice'.
*/

import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { sub } from 'date-fns';
import { apiSlice } from "../api/apiSlice";

/*
    2) ---------------
    After having all the neccessary imports we have to:
        1) Create an adapter using 'createEntityAdapter' method.
            => 'createEntityAdapter' is a method which takes 'configuration objects' as an optional arguments. Here that argument is 'sortComparer' which compares the data based on date property and returns their sorted order. 'createEntityAdapter' returns an 'adapter object' which is 'postAdapter' which contains the set of predefined methods for mamaging the state of the collection.
            => If we print the 'postAdapter' we will get an object which will contain all the methods which are allowed to be performed on 'postAdapter'.
        2) One of those methods is 'getInitialState' which gives us the initial state of our slice.
            => If we print the 'initalStat' variable we will get an object which will have two things: 
                    i) 'ids' which will be an empty array,
                    ii) 'entities' which will also be an empty array.
            => 'ids' will store 'id' of each post in an array.
            => 'entities' will store all the actual data in form of array of objects.
            => Both of them are empty initially, but as soon as we call the 'get' api both of them will be populated with the data in format as mentioned.
 */
const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

console.log("Posts adpater: ", postsAdapter)

const initialState = postsAdapter.getInitialState()

console.log("Initial state: ", initialState)

/* 
    3) ------------------
    After having initial state:
        1) We need to create 'extendedApiSlice' using 'injectEndpoints' method. This is the method which is used to inject the endpoints in the 'apiSlice'.
            => 'injectEndpoints' method takes an argument which is 'endpoints'.
            => The structure to create endpoints here is same as we did in basics.
*/
export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        /*
            => getPosts: It is the method which will fetch all the post form the user. It is a query method.
                The way to define this method is same as we have seen in basics.
        */
        getPosts: builder.query({
            query: () => '/posts',
            transformResponse: responseData => {
                let min = 1;
                const loadedPosts = responseData.map(post => {
                    if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    if (!post?.reactions) post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                });
                const result = postsAdapter.setAll(initialState, loadedPosts);
                console.log("Rsult of all posts: ", result)
                return result;
            },

            /*
                => The only change is in 'providesTags'. Earlier in basics, we used to directly give the names of tags to this property.
                => But for advanced version we need to understand that 'providesTags' method accepts three arguments 
                    i) result: The data returned by the 'query' or 'mutation'. Can be of any type or 'undefined' if the request failed.       
                            In our case the result is expected to be of array type that'why we have used 'square brackets' after arrow.
                    ii) error: This is the error returned by the query or mutation if it failed.
                    iii) args: These are the arguments which we have passed to method while making a request.
                            In our case the methos is 'getPosts' which does not accept any arguments so here the value of arguments is 'undefined'.
                => { type: 'Post', id: "LIST" }: This is used to give the data a tag. Here 'type' represents the tag which we have already defined in 'apiSlice' and 'id: "LIST"' represents that we are refering to entire collection. Technically we can use other values for 'id' but "LIST" is the most convinient value to represent entire collection.
                => 'type' and 'id' are provided by RTK query which allows us to add tag to data.
                => 'type' represents a category or type of data. It helps to group similar data items together. In our case the type is "Post" which represents all blog posts. For comments it can be "Comments".
                => 'id' uniquely identifies a specific data item or a group of data items within the specified type. This is ofteh a unique indentifier(like a PostId) or a special indentifier for a collection of items(like "LIST") to represent entire list of posts.
                => ...result.ids.map(id => ({ type: 'Post', id })): It adds a unique 'id' to each post so that it can be easy to invalidate cache while updating or deleting a post.
            */
            providesTags: (result, error, arg) => [
                { type: 'Post', id: "LIST" },
                ...result.ids.map(id => ({ type: 'Post', id }))
            ]
        }),
        getPostsByUserId: builder.query({
            query: id => `/posts/?userId=${id}`,
            transformResponse: responseData => {
                let min = 1;
                const loadedPosts = responseData.map(post => {
                    if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    if (!post?.reactions) post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                });
                const result = postsAdapter.setAll(initialState, loadedPosts);
                console.log("Rsult of single post: ", result)
                return result;

            },
            /*
                => Since, here we are not dealing with all the posts that'why we are not using { type: 'Post', id: 'LIST' } here.
                => We are mapping over the result and then adding individual id to each post tag.
            */
            providesTags: (result, error, arg) => [
                ...result.ids.map(id => ({ type: 'Post', id }))
            ]
        }),
        addNewPost: builder.mutation({
            query: initialPost => ({
                url: '/posts',
                method: 'POST',
                body: {
                    ...initialPost,
                    userId: Number(initialPost.userId),
                    date: new Date().toISOString(),
                    reactions: {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                }
            }),
            /*
                => Since adding a new posts is an operation which will effect whole collection that's why we are using { type: 'Post', id: 'LIST' } here.
            */
            invalidatesTags: [
                { type: 'Post', id: "LIST" }
            ]
        }),
        updatePost: builder.mutation({
            query: initialPost => ({
                url: `/posts/${initialPost.id}`,
                method: 'PUT',
                body: {
                    ...initialPost,
                    date: new Date().toISOString()
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
        deletePost: builder.mutation({
            query: ({ id }) => ({
                url: `/posts/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Post', id: arg.id }
            ]
        }),
        /* 
            => In our logic, to update or delete a post first we need to view that single post and inside that we can update and delete post. So as per our logic, updating and deleting post has nothing to do with all the posts in collection so we are not using { type: 'Post', id: 'LIST' }.
            => While updating or deleting a post we are passing 'id' as an argument so here 'arg' will not be undefined. We can extract the id from the arg to invalidate tags do refetching.
        */
        addReaction: builder.mutation({
            query: ({ postId, reactions }) => ({
                url: `posts/${postId}`,
                method: 'PATCH',
                // In a real app, we'd probably need to base this on user ID somehow
                // so that a user can't do the same reaction more than once
                body: { reactions }
            }),

            /* 
                => This below code snippet is used to perform Optimistic update in react.
                => 'onQueryStarted' is a method in RTK query is a lifecycle event hook that allows you to perform side effects when a query or mutation is initiated. It is particularly useful for handling optimisitic updates, additional data fetching or side effects like logging.
                => This hook accepts majorly accepts two arguments:
                        i) 'arg': These are the argument which we pass to the query or mutation. In our case it is 'postId, reactions' because that is what we are passing to the 'query' above,
                        ii) 'api': An object containing various properties and methods provided by RTK query to interact with the redux store and dispatch actions. This is an object therefoer we have used it by destructuring it. This object has follwing methods which we can use:
                            a) 'dispatch': the redux 'dispatch' function, allowing you to dispatch actions.
                            b) 'getState': A function that returns the current state of the store.
                            c) 'queryFulfilled': A promise that resolves when the query or mutation completes successfully or reject if it fails..
                            d) 'extra': An extra argument while configuring the API.
                => In our case we are using 'dispatch' to update the changes in redux store and using 'queryFulfilled' to check whether the reactions have successfully updated through API request in the original data not only in just UI.
            */
            /*
                => 'updateQueryData' is actual method which is used for optimsitic update. It is used to manually update the cached data of a specific query. This method requires three arguments which are: 
                    i) 'endpointName': The name of the endpoint whose data we want to update. In our case we want to update the data for 'getPosts' because this is the endpoint which will fetch all the posts from API.
                    ii) 'cacheKey': It is used to identify the specific cache entry. In our case it is 'undefined' because we want to update all the data. Suppose if we want to update only data for 'comments' and we have a tag for it with name 'comment' then we would have passed that.
                    iii) A 'callback' argument: This callback argument is a function that allows you to directly manipulate the cached data for a specific query. This callback takes an argument 'draft'.
                => 'draft' is a immer wrapped version of the current cached data. Immer is a JS library which allows us to work with immutable data structure in mutable way. What is happening internally is:
                    i) Immer provides a draft state, which is a type of proxy to the original state. We can modify this state as if they are mutable.
                    ii) Immer tracks all the changes made to the draft state.
                    iii) Once the modifications are completed, Immer produces a new immutable state that reflects the changes made to the draft state.
            */
           /*
                => The logic we are following here is first we get the current mutable state using 'draft' then in that state we search for particular using 'postId' and setting the reactions on that post equal to 'reactions'.
                => Later in try-catch block we are checking that query is fulfilled or not, using 'queryFulfilled' promise. If promise is rejected then it will throw an error which cwe we are catching in 'catch' block and reverting to the previous state which was actually saved using 'undo' method. 
           */
            async onQueryStarted({ postId, reactions }, { dispatch, queryFulfilled }) {
                // `updateQueryData` requires the endpoint name and cache key arguments,
                // so it knows which piece of cache state to update
                const patchResult = dispatch(
                    extendedApiSlice.util.updateQueryData('getPosts', undefined, draft => {
                        // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
                        const post = draft.entities[postId]
                        console.log("post is: ", post)
                        if (post) post.reactions = reactions
                    })
                )

                console.log("patch result:", patchResult)
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            }
        })
    })
})

/*
    => These all are the auto-generated hooks by RTK query.
*/
export const {
    useGetPostsQuery,
    useGetPostsByUserIdQuery,
    useAddNewPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useAddReactionMutation
} = extendedApiSlice


/*
    => 'select': It is a method provided by RTK query which allows us to select all the data of the endpoint on which we are calling it. Here, we are calling it on 'getPosts' endpoint from which we will get all the posts.
    => This method will return an object containing:
        i) status: The current status of request('pending', 'fulfilled', 'rejected')
        ii) data: The data returned by the query, if the request was successfull.
        iii) error   iv) idFetching   v) isLoading   vi) isSuccess   vii) isError
        viii) refetch: A function to refetch the data.
*/
// returns the query result object
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select()
console.log("Select post result: ", selectPostsResult)

/*
    => Memoized selector are created using 'createSelector' method.
    => 'createSelector' method accepts two arguments:
         i) Input selector: Functions accpeting the Redux state as their argument and returning a peice of the state. In general a selector on which we want to perform action. Here, we are taking input selector as 'selectPostResult' because this gives all the data and we want to perform action on that selector.
         ii) Result function: A function that recieves the output of the input selectors as its arguments and returns the computed result. This function recieves the output of the input selector explicitly.
    => In our case the output of the input selector which is 'selectPostResult' is being passed as an argument to the Result function by the name 'postResult' which is given by us, any name would work. Then we are extracting the 'data' property from the 'postResult' because as mentioned above 'selectPostResult' has above mentioned 8 properties out of which 'data' property has the actual data.
    => The result of the 'Result function' is cached. if the inputs to the selectors do not change, the cache result is returned instead of recomputing the derived data. 
    => That's how memoized selectors works and do caching.
*/
const selectPostsData = createSelector(
    selectPostsResult,
    postsResult => postsResult.data // normalized state object with ids & entities
)
console.log("Select post data: ", selectPostsData)


//getSelectors creates these selectors and we rename them with aliases using destructuring
const result = postsAdapter.getSelectors(state => selectPostsData(state) ?? initialState)
console.log("Result is: ", result)
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
    // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => selectPostsData(state) ?? initialState)