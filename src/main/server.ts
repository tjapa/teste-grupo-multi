import 'module-alias/register'
import { app } from './config/app'
import { env } from './config/env'
import { allJobs } from './jobs/all-jobs'

app.listen(env.port, () => {
  console.log(`Server running at http://localhost:${env.port}`)
})

allJobs.forEach((worker) => {
  console.log(`Running worker on ${worker.name}`)
  worker.run()
})
