import moduleAlias from "module-alias";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

// Register aliases for production (compiled code)
moduleAlias.addAliases({
  "@": path.join(__dirname, isProduction ? "../dist" : "../src"),
  "@config": path.join(
    __dirname,
    isProduction ? "../dist/config" : "../src/config"
  ),
  "@types": path.join(
    __dirname,
    isProduction ? "../dist/types" : "../src/types"
  ),
  "@services": path.join(
    __dirname,
    isProduction ? "../dist/services" : "../src/services"
  ),
  "@models": path.join(
    __dirname,
    isProduction ? "../dist/models" : "../src/models"
  ),
  "@controllers": path.join(
    __dirname,
    isProduction ? "../dist/api/controllers" : "../src/api/controllers"
  ),
  "@routes": path.join(
    __dirname,
    isProduction ? "../dist/api/routes" : "../src/api/routes"
  ),
  "@middleware": path.join(
    __dirname,
    isProduction ? "../dist/api/middleware" : "../src/api/middleware"
  ),
  "@utils": path.join(
    __dirname,
    isProduction ? "../dist/utils" : "../src/utils"
  ),
});
