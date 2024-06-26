<h4>Why do we need RTK query?</h4>
<p> RTK query is a tool based on redux which allows us to do following task easily.</p>
<ul>
    <li>
        <strong>Data Fetching and Synchronization: </strong> RTK query provides an declarative way to fetch and synchronize data with a backend. It abstracts away the complexities of making API requests, handling loading states, and updating the UI when data changes.
    </li>
    <li>
        <strong>Caching: </strong> It automatically caches the fetched data, reducing the need for repeated network requests. This improves performance and provides a better user experience by redcuing loading times.
    </li>
    <li>
        <strong>Data Normalization: </strong> RTK query helps in normalising the data, which makes it easier to manage and update data entities consistently across the application.
    </li>
    <li>
        <strong>Optimistic update: </strong> It allows optimistic update allowing the UI to respond immediately to user actions and update the server state in the background providing a smoother user experience.
    </li>
    <li>
        <strong>Error Handling: </strong> Provides built in mechanism for handling errors in data fetching, enabling developers to manage errors and dsiplay appropriate messages to users without much boilerplate code.
    </li>
    <li>
        <strong>Type safety: </strong> When used with TypeScript, RTK query offers type safety for API requests and responses, reducing runtime errors and improving developers productivity.
    </li>
</ul>
<hr>

<h4>What is basic structure to be followed while setting up an RTK query?</h4>
<p>The basic structure to setup RTK query is defined in RTK query Basic repo which is:</p>
<p>1) The file should be named with 'apiSlice.js'.</p>
<p>2) The location of file should be 'src/features/api/apiSlice.js'.</p>
<p>3) We need two methods to create an slice which are <br> i) createApi <br> ii)fetchBaseQuery</p>
<p>4) Then we use createApi method to create a slice.</p>

<h4>What is the setup for advanced RTK query?<h4>
<p> In advanced RTK query we do not define endpoints in apiSlice.js rather create extendedApiSlice and then endpoints in them.</p>
<p>For this project I have setup 'extendedApiSlice' for 'posts' in 'postSlice.jsx'</p>


<h3>Detailed notes are inside respective files only.</h3>
