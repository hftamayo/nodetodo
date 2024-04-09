import { JwtPayload } from 'jsonwebtoken';
import { User } from '../user.interface';

export interface JwtPayloadWithUser extends JwtPayload {
    searchUser: User;
}