import { NextRequest, NextResponse } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';
import { PRIVY_APP_ID, PRIVY_APP_SECRET } from '@/constants/env';

const privy = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Missing address query param' },
      { status: 400 },
    );
  }

  try {
    // 1) 通过钱包地址查询这个地址是否属于你项目里的某个用户
    const user = await privy.getUserByWalletAddress(address);

    if (!user) {
      return NextResponse.json(
        { found: false, reason: 'no_user_for_this_address' },
        { status: 404 },
      );
    }

    // 2) 从 linkedAccounts 里找 X 账号
    const twitterAcc = user.linkedAccounts.find(
      (acc: any) =>
        acc.type === 'twitter_oauth' ||
        acc.type === 'Twitter' ||
        acc.type === 'twitter',
    );

    if (!twitterAcc) {
      return NextResponse.json(
        { found: false, reason: 'user_has_no_twitter_linked' },
        { status: 404 },
      );
    }

    // 3) 整理需要返回给前端的字段（只挑你要用的）
    // 使用类型断言来访问 Twitter 账户的属性
    const twitterData = twitterAcc as any;
    const result = {
      found: true,
      address,
      privyUserId: user.id,
      twitter: {
        username: twitterData.username,
        name: twitterData.name,
        subject: twitterData.subject, // X OAuth 的稳定 ID
        avatarUrl:
          twitterData.profilePictureUrl || twitterData.profile_picture_url,
      },
    };

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Error fetching user by wallet address:', err);
    return NextResponse.json(
      { error: 'internal_error', detail: err?.message },
      { status: 500 },
    );
  }
}
