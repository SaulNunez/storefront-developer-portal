# StorefrontDeveloperPortal

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.10.

## Running against the Storefront backend

The portal is served from the same host as the Storefront backend and signs in with its
ASP.NET Identity cookie, so there is no CORS or token setup. In development, `ng serve`
proxies `/api`, `/Identity` and the backend's static files to `http://localhost:5000`
(see `proxy.conf.json`), which is where `dotnet run` listens by default. Start the backend
first, then `ng serve`.

Signed-out API calls return 401 and the portal sends you to the Identity login page, which
returns you to the portal afterwards. Creating applications needs the `Developer` (or
`Administrator`) role on your account; without it the API answers 403.

Icons are uploaded to the backend (`POST /api/developers/applications/{id}/icon`), which
stores them in S3-compatible object storage.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
