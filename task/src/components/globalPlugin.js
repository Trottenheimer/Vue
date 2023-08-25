import * as globalFunctions from "@/components/globalFunctions"
import globalVariables from "./globalVariables"

export default{
    install(app){
        for (const [name, func] of Object.entries(globalFunctions)){
            app.config.globalProperties[`$${name}`] = (...args) => func(...args)
        }
        for (const [name, value] of Object.entries(globalVariables)) {
            app.config.globalProperties[`$${name}`] = value
          }
    }
}