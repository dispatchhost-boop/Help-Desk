const express = require('express');
const jwt = require('jsonwebtoken');
const flash = require('connect-flash');
const {getNestedUserIds ,getNestedUsersByClientIds, getNestedChildClients  } = require('../utility/getNestedUserIds');

const auth = async (req, res, next) => {
    try {
        // Retrieve the token from cookies
        const token = req.cookies.jwt;

        console.log("Token from cookies:", token); // Log the token

        // Check if token is missing
        if (!token) {
            req.flash("errors", "You Are Not Authorized, Please Login First ...");
            return res.redirect("/");
        }

        // Verify and decode the token
        const decode = await jwt.verify(token, process.env.TOKEN_KEY);

        // Log the expiration time in human-readable format
        if (decode.exp) {
            const expirationTime = new Date(decode.exp * 1000); // Convert seconds to milliseconds
            console.log("Token Expiration Time:", expirationTime.toLocaleString());
        }
        //   ------------------
        // Attach user data to request object
        req.user = decode;
        // attach selected user id and selected client id 
         const rawSelection = req.cookies.selection; // string
        req.user.selectedClientId = null;
        req.user.selectedUserId = null;

        if (rawSelection) {
            try {
                const parsed = JSON.parse(rawSelection);           

                    req.user.selectedClientId = parsed.selectedClientId || null;
                    req.user.selectedUserId = parsed.selectedUserId || null;

            } catch (err) {
                console.error("Invalid selection cookie:", rawSelection);
                req.user.selectedClientId = null;
                req.user.selectedUserId = null;
            }
        }

    //    if (rawSelection) {
    //         try {
    //             const parsed = JSON.parse(rawSelection);
    //             const selectedClientId = parsed.selectedClientId || null;
    //             const selectedUserId = parsed.selectedUserId || null;

    //             // Super admin can select anything directly
    //             if (decode.id === 1) {
    //                 req.user.selectedClientId = selectedClientId;
    //                 req.user.selectedUserId = selectedUserId;
    //                 return;
    //             }

    //             // Client or sub-client (level 2 or 3)
    //             if (decode.level === 2 || decode.level === 3) {
    //                 // 1️⃣ Validate client selection
    //                 if (selectedClientId) {
    //                     const nestedClientIds = await getNestedChildClients(decode.id);
    //                     if (!nestedClientIds.includes(selectedClientId)) {
    //                         return res.status(403).json({ error: "Access Denied! Unauthorized Client Access" });
    //                     }
    //                 }

    //                 // 2️⃣ Validate user selection if provided
    //                 if (selectedUserId) {
    //                     const nestedUserIds = await getNestedUsersByClientIds(selectedClientId || decode.id);
    //                     if (!nestedUserIds.includes(selectedUserId)) {
    //                         return res.status(403).json({ error: "Access Denied! Unauthorized User Access" });
    //                     }
    //                 }

    //                 // ✅ Only assign after successful validation
    //                 req.user.selectedClientId = selectedClientId;
    //                 req.user.selectedUserId = selectedUserId;
    //             }

    //         } catch (err) {
    //             console.error("Invalid selection cookie:", rawSelection);
    //             req.user.selectedClientId = null;
    //             req.user.selectedUserId = null;
    //         }
    //     }


       console.log("req.user in middleware",req.user)
        // Optional: Check if token has expired
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        if (decode.exp < currentTime) {
            req.flash("errors", "Session expired, please login again ...");
            return res.redirect("/");
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Auth error:", error);
        req.flash("errors", "You Are Not Authorized, Please Login First ...");
        return res.redirect("/");
    }
};
const ensureKYCApproved = (req, res, next) => {
    const user = req.user;

    if (!user) {
        req.flash("errors", "Authentication required.");
        return res.redirect('/');
    }

    // ✅ Check only for 'user' role
    if (user.role === 'user' && user.kyc_status !== 'approved') {
        req.flash("errors", "Your KYC is still pending. Please complete it to proceed.");
        return res.redirect('/kyc');  // 🔁 redirect to KYC page
    }

    next(); // 🟢 Allow access
};


module.exports ={ auth,
    ensureKYCApproved
}
