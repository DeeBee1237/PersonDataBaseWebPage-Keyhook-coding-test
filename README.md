
To run the backend:

```bash
bundle install
bundle exec rackup -p 4567
```

The frontend folder has a Typescript+React app ready to go, it is using vite for bundling / running the app.
To run just:

```
yarn install
yarn dev
```

The React app should be a single page ( no routing needed ), that satisfies the following criteria.

- Uses the Tanstack table library to show a list of employees from the API.
  - The table should show these columns:
    - First Name
    - Last Name
    - Age
    - Position
    - Department Name
- You can use the Spraypaint.js library or another JSONAPI library if you'd like.
- The table should have some basic styling applied with tailwind css.
- Table data should be paginated.
- Sorting should be enabled on the first_name,last_name, age, position columns.
- Add a search bar that allows typing in a name and filters the records by a custom graphiti name filter.
  - This filter should search across both the first_name and last_name columns.
- You will need to add the graphiti resource for Employees.

All sorting,paginating and filtering should happen through the server side query and should not be done on the frontend.

Our app is entirely built on React hooks, so please be sure to use hooks and functional components instead of class components.

You are free to use any other packages you would like to use to build the frontend.
You are free to use any documentation or google anything you might not know.

