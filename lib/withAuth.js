import { Component } from "react";
import axios, { signature_exp } from "lib/axios";
import Router from "next/router";
import nookies from "nookies";

/*
 * Function for checking when user go to page that needs authentication 
 * @param {object} ctx - The Next.JS context object
 * @param {bool} isAdmin - Check the page that the user want to visit
 */

const redirect = (ctx, destination) => {
  ctx.res.writeHead(302, { Location: destination });
  ctx.res.end();
}

const authenticate = async (ctx, isAdmin, isUserAdmin) => {
  const { csrf_access_token, NEXT_LOCALE } = nookies.get(ctx);

  const locale = NEXT_LOCALE && NEXT_LOCALE !== "id" ? NEXT_LOCALE : ""

  if (ctx.req && !csrf_access_token) {
    redirect(ctx, `/${locale}`)
    return false;
  }

  if (!csrf_access_token) {
    Router.replace(`/${locale}`);
    return false;
  }

  console.log("isAdminPage -> ", isAdmin)
  console.log("isUserAdmin-> ", isUserAdmin)

  /*
   * if user visit admin page
   */

  if(isAdmin){
    if(!isUserAdmin && ctx.req) {
      redirect(ctx, "/")
      return false;
    }
    if(!isUserAdmin && !ctx.req) {
      Router.replace("/");
      return false;
    }
    if(isUserAdmin) {
      return csrf_access_token && isUserAdmin && isAdmin
    }
  } else {
    return csrf_access_token; // add user not null
  }
};

/*
 * HOC withAuth is a Wrapped Component for pages that needs authentication
 * @param {Component} WrappedComponent - The component that needs to be wrapped with authentication
 */
const withAuth = (WrappedComponent) => {
  return class extends Component {
    static async getInitialProps(ctx) {
      let isUserAdmin = false;
      const { csrf_access_token } = nookies.get(ctx);
      const isAdmin = ctx.pathname.startsWith("/admin");
      if(isAdmin && csrf_access_token){
        if(ctx.req) axios.defaults.headers.get.Cookie = ctx.req.headers.cookie;
        await axios.get("/users/my-user")
          .then(res => {
            if(res.data.role === "admin") isUserAdmin = true;
            else isUserAdmin = false;
          })
          .catch(async err => {
            if(err.response.data.detail === signature_exp){
              await axios.get("/users/my-user")
                .then(res => {
                  if(res.data.role === "admin") isUserAdmin = true;
                  else isUserAdmin = false;
                })
                .catch(() => {})
            }
            else {
              axios.delete("/users/delete-cookies")
              isUserAdmin = false
            }
          })
      }

      const isAuth = await authenticate(ctx, isAdmin, isUserAdmin);
      const componentProps = WrappedComponent.getInitialProps && await WrappedComponent.getInitialProps(ctx);
      return { ...componentProps, isAuth };
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};

export { withAuth };
