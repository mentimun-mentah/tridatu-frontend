import { withAuth } from 'lib/withAuth'
import Router from 'next/router'

const Account = () => null;

Account.getInitialProps = (ctx) => {
  if(process.browser){
    Router.replace("/account/profile", "/account/profile")
  } 
  else {
    ctx.res.writeHead(302, { Location: "/account/profile" })
    ctx.res.end();
  }
};

export default withAuth(Account)
