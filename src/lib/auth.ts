import { cookies } from 'next/headers';
import dbConnect from './db';
import { User, IUser } from '@/models/User';

export async function getSessionUser(): Promise<IUser | null> {
  await dbConnect();
  
  // We'll read from a stub cookie. 
  const cookieStore = await cookies();
  const stubUserId = cookieStore.get('stub_user_id')?.value;
  
  if (stubUserId) {
    const user = await User.findById(stubUserId);
    if (user) return user;
  }
  
  // If no cookie, just grab the first admin we can find (Fallback for demo purposes)
  const fallbackUser = await User.findOne({ role: 'admin' });
  return fallbackUser as IUser | null;
}
