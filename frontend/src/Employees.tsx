
    import {useQuery} from '@tanstack/react-query';
    import TextField from "@mui/material/TextField";
    import { useState, useEffect } from "react";

    type EventTarget = {
      value: string
    }

    type Event = {
      target: EventTarget
    }

    type EmployeeAttributes = {
      first_name: string
      last_name: string
      age: number
      position: string
      department_id: string
    }

    type Employee = {
      attributes: EmployeeAttributes
    }

    type EmployeeData = {
      data: [Employee]
    }

    type DepartmentAttributes = {
      name: string
    }

    type Department = {
      id: number
      attributes: DepartmentAttributes
    }

    // TODO the typescript for this is not quite right, but this shouldnt be on the front end anyway 
    // ... a join can be done on server side 
    type DepartmentData = { 
      data: [Department]
    }

    function useEmployees(page: number, searchText: string, columnSortName: string, departmentName: string) {

      return useQuery({
        queryKey: ['employees'],
        queryFn: async (): Promise<EmployeeData> => {

          var url = `http://localhost:4567/api/v1/epmployees/${page}/${columnSortName}`

          if (departmentName.trim() != "") {
            url = `http://localhost:4567/api/v1/epmployees_filter_by_department/${departmentName}/${page}`
          } else if (searchText.trim() != "") {
            url = `http://localhost:4567/api/v1/epmployees_filter/${searchText}`
          }

          const response = await fetch(url) 
          return await response.json()
        },
      })
    }

    // Again, this join should happen on server side and maybe create a ruby version of a View,
    // I really dont like doing this here, and even if it is on front end it should be computed once and passed down as a prop ..
    function useDepartments() {

      return useQuery({
        queryKey: ['departments'],
        queryFn: async (): Promise<DepartmentData> => {
          let url = `http://localhost:4567/api/v1/departments/`
          const response = await fetch(url) 
          return await response.json()
        },
      })
    }

    const Employees = () => {
      
      const [page, setPage] = useState(1)
      const [searchText, setSearchText] = useState("")

      // made this the default, although now I have the same column name on front end and back end ... which is not good, should improve it
      const [columnSortName, setColumnSortName] = useState("first_name")
      const [departmentFilterName, setDepartmentFilterName] = useState("")

      const { status, data, error, isFetching, refetch} = useEmployees(page, searchText, columnSortName, departmentFilterName)
      
      // This component is made to re-render with every call to refetch in use effect when the state vars change
      // so its expensive to do this here, i want to caluclate it up the react tree, in parent component and pass result in as props
      // maybe put in a redux store ... then  again im only doing this because i couldnt figure how to do the join with ruby and i didnt want to change the DB structure
      const departments = useDepartments()

      useEffect(() => {
        refetch(page, searchText, columnSortName, departmentFilterName)
      }, [page, searchText, columnSortName, departmentFilterName]);

      let inputHandler = (e : Event) => {
        setSearchText(e.target.value);
      };

    return (

      <div class="main-container">
        
        <div>
        <h1>Employees </h1>
        <div>

          <TextField
            id="outlined-basic"
            onChange={inputHandler}
            variant="outlined"
            fullWidth
            class="search-bar"
          />

          <div class="department-filter-container">
              <select 
                name="department" 
                id="department"
                onChange={(e : Event) => {
                  setDepartmentFilterName(e.target.value)
                }}
                class="department-drop-down"
                >
                  {/* This is not great either; if we change the order of data in departments table we'd have to change it here too ... how to improve ??  */}
                  <option value="1">Engineering</option>
                  <option value="2">Product</option>
                  <option value="3">Legal</option>
                  <option value="4">Marketing</option>
                  <option value="5">Sales</option>
                  <option value="6">Support</option>
                  <option value="7">HR</option>
                  <option value="8">Finance</option>
                  <option value="9">Operations</option>
                  <option value="10">IT</option>
              </select>

              <button className="prev-button" onClick={() => {
                setPage(1)
                setDepartmentFilterName("")
              }}>
                Remove Department Filter   
              </button>
          </div>

          {status === 'pending' || departments.status == 'pending' ? (
            'Loading...'
          ) : status === 'error' || departments.status == 'error' ? (
            <span>Error: {error?.message ?? "Error Loading Data"}</span>
          ) : (
            <>
        <div>

        <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                  <th scope="col" className="px-6 py-3">
                      <button className="prev-button" onClick={() => {
                        setColumnSortName("first_name")
                      }}>
                    First Name   
                      </button>
                  </th>

                  <th scope="col" className="px-6 py-3">
                      <button className="prev-button" onClick={() => {
                        setColumnSortName("last_name")
                      }}>
                    Last Name   
                      </button>
                  </th>

                  <th scope="col" className="px-6 py-3">
                      <button className="prev-button" onClick={() => {
                        setColumnSortName("age")
                      }}>
                    Age 
                      </button>
                  </th>

                  <th scope="col" className="px-6 py-3">
                      <button className="prev-button" onClick={() => {
                        setColumnSortName("position")
                      }}>
                    Position 
                      </button>
                  </th>

                  <th scope="col" className="px-6 py-3">
                    Department
                  </th>
              </tr>
          </thead>
          
          <tbody>
          {data.data.map((employee: Employee, i: number) => ( 
            <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {employee.attributes.first_name}
            </th>
            <td className="px-6 py-4">
                {employee.attributes.last_name}
            </td>
            <td className="px-6 py-4">
                {employee.attributes.age}
            </td>
            <td className="px-6 py-4">
                {employee.attributes.position}
            </td>
            <td className="px-6 py-4">
                {departments.data.data.find((element) => element.id == employee.attributes.department_id)?.attributes.name}
            </td>
            </tr>
          ))}
          </tbody>
        </table>
        </div>
              </div>
              <div>{isFetching ? 'Background Updating...' : ' '}</div>
            </>
          )}
        </div>

        <div>

        </div>

          <div className="button-container">
          <button className="prev-button" onClick={() => {
              if (page > 1) { 
                setPage(page - 1)
              }
          }      
          }>
            Prev   
          </button>

          <button className="next-button" onClick={() => {
              setPage(page + 1)
            } 
          }>
            Next   
          </button>
          

          </div>

          {/* TODO https://legacy.reactjs.org/docs/portals.html */}

        </div>

  </div>
      )
    }

    export default Employees
