import { ApplicationDefinition } from './ApplicationDefinition';
import { ApplicationEnhancer } from '../../tools/ApplicationEnhancer';
import { errors } from '../errors';
import { exists } from '../utils/fs/exists';
import { getDomainDefinition } from './getDomainDefinition';
import { getViewsDefinition } from './getViewsDefinition';
import path from 'path';
import { withSystemDomainEvents } from '../../tools/withSystemDomainEvents';

const getApplicationDefinition = async function ({ applicationDirectory }: {
  applicationDirectory: string;
}): Promise<ApplicationDefinition> {
  if (!await exists({ path: applicationDirectory })) {
    throw new errors.ApplicationNotFound();
  }

  const packageManifestPath = path.join(applicationDirectory, 'package.json');
  const serverDirectory = path.join(applicationDirectory, 'build', 'server');

  if (!await exists({ path: packageManifestPath })) {
    throw new errors.FileNotFound(`File '<app>/package.json' not found.`);
  }
  if (!await exists({ path: serverDirectory })) {
    throw new errors.DirectoryNotFound(`Directory '<app>/build' not found.`);
  }

  const packageManifest = (await import(packageManifestPath)).default;

  const domainDirectory = path.join(serverDirectory, 'domain');
  const viewsDirectory = path.join(serverDirectory, 'views');

  const domainDefinition = await getDomainDefinition({ domainDirectory });
  const viewsDefinition = await getViewsDefinition({ viewsDirectory });

  const applicationEnhancers: ApplicationEnhancer[] = [
    withSystemDomainEvents
  ];

  const rawApplicationDefinition: ApplicationDefinition = {
    rootDirectory: applicationDirectory,
    packageManifest,
    domain: domainDefinition,
    views: viewsDefinition
  };

  const enhancedApplicationDefinition = applicationEnhancers.reduce(
    (applicationDefinition, applicationEnhancer): ApplicationDefinition =>
      applicationEnhancer(applicationDefinition),
    rawApplicationDefinition
  );

  return enhancedApplicationDefinition;
};

export { getApplicationDefinition };
