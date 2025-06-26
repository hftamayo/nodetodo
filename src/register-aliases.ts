import moduleAlias from 'module-alias';
import path from 'path';

// Register aliases for production (compiled code)
moduleAlias.addAliases({
  '@': path.join(__dirname),
  '@config': path.join(__dirname, 'config'),
  '@types': path.join(__dirname, 'types'),
  '@services': path.join(__dirname, 'services'),
  '@models': path.join(__dirname, 'models'),
  '@controllers': path.join(__dirname, 'api/controllers'),
  '@routes': path.join(__dirname, 'api/routes'),
  '@middleware': path.join(__dirname, 'api/middleware'),
  '@utils': path.join(__dirname, 'utils'),
});