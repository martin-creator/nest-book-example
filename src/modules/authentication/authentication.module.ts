import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { DynamicModule, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';

@Module({})
export class AuthenticationModule {
    static forRoot(strategy?: 'jwt'): DynamicModule {
        strategy = 'jwt';
        const strategyProvider = {
            provide: 'Strategy',
            useFactory: async (authenticationService: AuthenticationService) => {
                const Strategy = (await import (`./passports/${strategy}.strategy`)).default;
                return new Strategy(authenticationService);
            },
            inject: [AuthenticationService]
        };
        return {
            module: AuthenticationModule,
            imports: [UserModule],
            controllers: [AuthenticationController],
            components: [AuthenticationService, strategyProvider],
            exports: [strategyProvider]
        };
    }
}
