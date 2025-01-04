
import {QueryClient} from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import Employees from './Employees';

const App = () => {

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
      },
    },
  })
  
  const persister = createSyncStoragePersister({
    storage: window.localStorage,
  })

  // if Departments MUST be on front end (should be a join on server side) then it should be computed here 
  // and passed down as a prop to the Employees component, couldn't solve this error though : ...
  // Uncaught Error: No QueryClient set, use QueryClientProvider to set one
  
  return (
    
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <Employees/>

    </PersistQueryClientProvider>

  )


}

export default App
