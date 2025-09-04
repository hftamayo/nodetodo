import moduleAlias from "module-alias";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

// In production (Docker), we are in /app/dist/ and need to point to /app/dist/
// In development, we are in /app/src/ and need to point to /app/src/
const srcDir = isProduction ? __dirname : path.join(__dirname, "..", "src");

console.log(
  `Module alias registration - Production: ${isProduction}, Source dir: ${srcDir}`
);

// Register aliases for both development and production
moduleAlias.addAliases({
  "@": srcDir,
  "@config": path.join(srcDir, "config"),
  "@types": path.join(srcDir, "types"),
  "@services": path.join(srcDir, "services"),
  "@models": path.join(srcDir, "models"),
  "@controllers": path.join(srcDir, "api", "controllers"),
  "@routes": path.join(srcDir, "api", "routes"),
  "@middleware": path.join(srcDir, "api", "middleware"),
  "@utils": path.join(srcDir, "utils"),
});
