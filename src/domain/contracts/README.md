# Domain Contracts

This folder contains shared interfaces and symbol tokens used for dependency injection across the application.

Guidelines

- Define interface types describing the public methods a consumer needs.
- Export a symbol token for DI (prefer Symbol over string literals).
- Update `src/domain/contracts/index.ts` to export new contracts so consumers can import from a single location.

Example

```ts
import {
  ACTIVITIES_REPOSITORY,
  IActivitiesRepository,
} from 'src/domain/contracts';

@Injectable()
export class ActivitiesService {
  constructor(
    @Inject(ACTIVITIES_REPOSITORY) private readonly repo: IActivitiesRepository,
  ) {}
}
```
