module.exports = {

    MESSAGE_ADDED: {

        "status": "Success",
        "message": "Message Added Successfully",
        "messages": ""

    },
    IMAGE_ADDED: {
        "status": "Success",
        "message": "image added Successfully",
        "data": ""
    },
    INCORRECT_USERNAME_PASSWORD: {
        "status": "Failure",
        "message": "Username Or Password Is Incorrect",
        "data": ""
    },
    LOGIN_SUCCESS: {
        "status": "Success",
        "message": "Logged In Successfully",
        "data": ""
    },

    SOMETHING_WENT_WRONG: {
        "status": "Failure",
        "message": "Something went wrong! Please Try Again later.",
        "data": ""
    },
    INVALID_TOKEN: {
        "status": "Failure",
        "message": "Invalid or No Token",
        "data": "UnAuthorized Access"
    },
    LOGOUT: {
        "status": "Success",
        "message": "Logged Out Successfully",
        "data": ""
    },
    PASSWORD_CHANGED: {
        "status": "Success",
        "message": "Password Changed Successfully",
        "data": ""
    },
    PASSWORD_NOT_MATCH: {
        "status": "Failure",
        "message": "Password and Confirm password does not matched",
        "data": ""
    },
    NOT_REGISTERED: {
        "status": "Failure",
        "message": "Not a Registered User! Please enter a Valid Email",
        "data": ""
    },
    SIGNUP_SUCCESS: {
        "status": "Success",
        "message": "Signup Success! Please check your email for verification token",
        "data": "",
        "otp": ""
    },
    OTP_SEND: {
        "status": "Success",
        "message": "Otp is Sent to registered email address",
        "data": ""
    },
    EXPIRED_OTP: {
        "status": "Failure",
        "message": "OTP Is Expired",
        "data": ""
    },
    OTP_NOT_MATCH: {
        "status": "Failure",
        "message": "OTP Does Not Match",
    },
    VALID_OTP: {

        "status": "Success",
        "message": "OTP Is Valid",
    },
    ADDED: {
        "status": "Success",
        "message": "Added Successfully",
        "data": ""
    },
    UPDATED: {
        "status": "Success",
        "message": "Updated Successfully",
        "data": ""
    },
    UPDATED_USER: {
        "status": "Success",
        "message": "Updated Successfully",
        "data": []
    },
    DELETE: {
        "status": "Success",
        "message": "Deleted Successfully",
        "data": ""
    },
    FETCH: {
        "status": "Success",
        "message": "Fetched Successfully",
        "data": ""
    },
    NO_DATA_FOUND: {
        "status": "Failure",
        "message": "No Data Found",
        "data": ""
    },
    ERROR: {
        "status": "Failure",
        "message": "Internal DB Error",
        "data": ""
    },
    NO_ROOM_ERROR: {
        "status": "Failure",
        "message": "No Rooms Found!",
        "data": ""
    },
    CHAT_ERROR: {
        "status": "Failure",
        "message": "No Rooms Available",
        "data": ""
    },
    FIRST_NAME: {
        "status": "Bad Request",
        "message": "first name can not be empty",
        "data": "Hints"
    },
    EMAIL_ALREADY_EXISTS: {
        "status": "Failure",
        // "message" : "This email'id registered with “Student/Teacher“ Profile. Please try again.",
        "message": "Email address already exist, please use different email address.",
        "data": "Validation Error"
    },
    REQUEST_ALREADY_EXISTS: {
        "status": "Bad Request",
        "message": "Request already exists",
        "data": "Validation Error"
    },
    ALREADY_APPLIED_EXISTS: {
        "status": "400",
        "message": "Already Applied For This Job",
        "data": "Validation Error"
    },
    CLASS_ALREADY_EXISTS: {
        "status": "400",
        "message": "Class already exists",
        "data": "Validation Error"
    },
    QUESTION_ALREADY_EXISTS: {
        "status": "Bad Request",
        "message": "You Can Only Ask 3 Questions",
        "data": "Validation Error"
    },
    INVALID_CONFIRM_PASSWORD: {
        "status": "Bad Request",
        "message": "Confrim Password DoesNot Match ",
        "data": "Error"
    },
    DB_ERROR: {
        "status": "Internal Server Error",
        "message": "Error in DB",
        "data": "DB Error"
    },
    NO_PROPERTY: {
        "status": "Bad Request",
        "message": "No Property Found",
        "data": "Bad Request"
    },
    INTERNAL_SERVER_ERROR: {
        "status": "Server error",
        "message": "Something went wrong! Please try again later",
        "data": "Server Error"
    },
    ERROR_CREATE_EMAIL_TOKEN: {
        "status": "Server Error",
        "message": "Something went wrong! Please try again later",
        "data": "Plugins Error"
    },
    ERROR_SENDING_EMAIL: {
        "status": "Server Error",
        "message": "Something went wrong! Please try again later",
        "data": "Plugins Error"
    },
    SUCCESS_SENDING_EMAIL: {
        "status": "Success",
        "message": "Signup Success! Please check your email for verification token",
        "data": "Success"
    },
    ERROR_FINDING_EMAIL: {
        "status": "warning",
        "message": "Email is not registered with us! Please sign up",
        "data": "Not Found"
    },
    EMAIL_ALREADY_VERIFIED: {
        "status": "warning",
        "message": "Email Already Verified! Please Login",
        "data": "Token Expired"
    },
    INVALID_EMAIL_TOKEN: {
        "status": "BAD REQUEST",
        "message": "Invalid Email verification token",
        "data": "Invalid token"
    },
    EMAIL_VERIFIED: {
        "status": "Success",
        "message": "Email Verified! Please Login",
        "data": "Success"
    },
    ERROR_DECODE_TOKEN: {
        "status": "Bad Request",
        "message": "Not a Valid Token",
        "data": "Error"
    },
    USERDATA_UPDATED: {
        "status": "Success",
        "message": "User Data Updated Successfully",
        "data": "Success"
    },
    ERROR_FINDING_DATA: {
        "status": "warning",
        "message": "Error Finding Data",
        "data": "Not Found"
    },
    INVALID_OR_NO_TOKEN: {
        "status": "Bad Request",
        "message": "Not a Valid Token",
        "data": "Error"
    },
    INVALID_CURRENT_PASSWORD: {
        "status": "Bad Request",
        "message": "Invalid Current Password",
        "data": "Error"
    },
    BCRYPT_ERROR: {
        "status": "Bad Request",
        "message": "Internal Server Error",
        "data": "bcrypt Error"
    },
    PASSWORD_UPDATED_SUCCESS: {
        "status": "Success",
        "message": "Password Changed Successfully",
        "data": "Success"
    },
    INVALID_EMAIL: {
        "status": "Failure",
        "message": "Please enter a valid email",
        "data": "Bad Request"
    },
    ERROR_IN_PASSWORD_RESET_TOKEN: {
        "status": "Failure",
        "message": "Error in Generating password reset token! Please try again later",
        "data": "Internal Server Error"
    },
    ERROR_IN_MANDRILL: {
        "status": "Failure",
        "message": "Error in sending password reset token! Please try again later",
        "data": "Internal Server Error"
    },
    FORGET_PASSWORD_SUCCESS: {
        "status": "Success",
        "message": "Please Check your email for reset password token",
        "data": "Success"
    },
    ADD_BLOG_SUCCESS: {
        "status": "Success",
        "message": "Blog Added Successfully",
        "data": "Success"
    },
    S3_ERROR: {
        "status": "Failure",
        "message": "An error occured while uploading file! Please try again later",
        "data": "Internal Server Error"
    },
    FORMIDABLE_ERROR: {
        "status": "Failure",
        "message": "An error occured while retrieving data! Please try again later",
        "data": "Internal Server Error"
    },
    INVALID_FILE_TYPE: {
        "status": "Failure",
        "message": "Uploaded image type not supported",
        "data": "Bad Request"
    },
    VIEWMYBLOGS_NO_DATA: {
        "statusCode": "404",
        "status": "Failure",
        "message": "No Blogs Found",
        "type": "Bad Request"
    },
    VIEWALLBLOGS_NO_DATA: {
        "statusCode": "404",
        "status": "Failure",
        "message": "No Blogs Found",
        "type": "Bad Request"
    },
    VIEWBLOGSBYID_NO_DATA: {
        "statusCode": "404",
        "status": "Failure",
        "message": "No Blogs Found",
        "type": "Bad Request"
    },
    VIEWBLOG_NO_DATA: {
        "statusCode": "404",
        "status": "Failure",
        "message": "No Blog Found",
        "type": "Bad Request"
    },
    UPDATEBLOG_NO_DATA: {
        "statusCode": "404",
        "status": "Failure",
        "message": "No Blog Found to update",
        "type": "Bad Request"
    },
    UPDATE_BLOG_SUCCESS: {
        "statusCode": "200",
        "status": "Success",
        "message": "Blog Updated Successfully",
        "type": "Success"
    },
    DELETEBLOG_NO_DATA: {
        "statusCode": "404",
        "status": "Failure",
        "message": "No Blog Found",
        "type": "Bad Request"
    },
    DELETEBLOG_SUCCESS: {
        "statusCode": "200",
        "status": "Success",
        "message": "Blog Deleted Successfully",
        "type": "Success"
    },
    SUCCESS_ADD_EVENT_REMINDER: {
        "statusCode": "200",
        "status": "Success",
        "message": "Reminder Added Successfully",
        "type": "Success"
    },
    FAILURE_ADD_EVENT_REMINDER: {
        "statusCode": "500",
        "status": "Failure",
        "message": "Something went wrong!  please try again later",
        "type": "Bad Request"
    },
    FAILURE_SHOWMYREMINDERS: {
        "statusCode": "500",
        "status": "Failure",
        "message": "No reminders found",
        "type": "Bad Request"
    },
    FAILURE_SHOWREMINDER: {
        "statusCode": "500",
        "status": "Failure",
        "message": "Reminder Not found",
        "type": "Bad Request"
    },
    FAILURE_DELETEREMINDER: {
        "statusCode": "500",
        "status": "Failure",
        "message": "Reminder Not found",
        "type": "Bad Request"
    },
    SUCCESS_UPDATE_EVENT_REMINDER: {
        "statusCode": "200",
        "status": "Success",
        "message": "Reminder Added Successfully",
        "type": "Success"
    },
    FAILURE_UPDATE_EVENT_REMINDER: {
        "statusCode": "500",
        "status": "Failure",
        "message": "Something went wrong!  please try again later",
        "type": "Bad Request"
    },
    SITESETTINGSUPDATE_NO_DATA: {
        "statusCode": "404",
        "status": "Failure",
        "message": "No Site Settings Found",
        "type": "Bad Request"
    },
    UPDATE_SETTINGS_SUCCESS: {
        "statusCode": "200",
        "status": "Success",
        "message": "Settings Updated Successfully",
        "type": "Success"
    },
    ERROR_FINDING_PROPERTY_SEARCH: {
        "statusCode": "404",
        "status": "Failure",
        "message": "No Properties Found matching your search criteria",
        "type": "Bad Request"
    },
    ERROR_FINDING_LISTINGS: {
        "statusCode": "404",
        "status": "Failure",
        "message": "Listings Not Found",
        "type": "Bad Request"
    },
    ERROR_FINDING_LISTING: {
        "statusCode": "404",
        "status": "Failure",
        "message": "Listings Not Found",
        "type": "Bad Request"
    },
    ERROR_FINDING_SETTINGS: {
        "statusCode": "404",
        "status": "Failure",
        "message": "Settings Not Found",
        "type": "Bad Request"
    },
    ERROR_FINDING_CITIES: {
        "statusCode": "404",
        "status": "Failure",
        "message": "CITIES Not Found",
        "type": "Bad Request"
    },
    ERROR_FINDING_AREAS: {
        "statusCode": "404",
        "status": "Failure",
        "message": "Areas Not Found",
        "type": "Bad Request"
    },
    ERROR_FINDING_BLOGS: {
        "statusCode": "404",
        "status": "Failure",
        "message": "Blogs Not Found",
        "type": "Bad Request"
    },
    ERROR_FINDING_TESTIMONIALS: {
        "statusCode": "404",
        "status": "Failure",
        "message": "Testimonials Not Found",
        "type": "Bad Request"
    },
    ERROR_FINDING_PAGES: {
        "statusCode": "404",
        "status": "Failure",
        "message": "Pages Not Found",
        "type": "Bad Request"
    },
    ERROR_FINDING_NAVIGATION: {
        "statusCode": "404",
        "status": "Failure",
        "message": "Navigation pages Not Found",
        "type": "Bad Request"
    },
    ERROR_FINDING_TEAM: {
        "statusCode": "404",
        "status": "Failure",
        "message": "Team Not Found",
        "type": "Bad Request"
    },
    ERROR_FINDING_PROPERTIES: {
        "statusCode": "404",
        "status": "Failure",
        "message": "Properties Not Found",
        "type": "Bad Request"
    },
    ERROR_FINDING_CATEGORY: {
        "statusCode": "404",
        "status": "Failure",
        "message": "Categories Not Found",
        "type": "Bad Request"
    },
    NO_ACCESS: {
        "statusCode": "401",
        "status": "Unauthorized",
        "message": "Access Key is either invalid or empty",
        "type": "Bad Request"
    },
    ERROR_FINDING_FOOTER_NAVIGATION: {
        "statusCode": "404",
        "status": "Failure",
        "message": "Footer Navigation Not Found",
        "type": "Bad Request"
    },
    EDIT_LEAD_SUCCESS: {
        "statusCode": "200",
        "status": "Success",
        "message": "Lead Updated Successfully",
        "type": "Success"
    },
    LEAD_LOGS_SUCCESS: {
        "statusCode": "200",
        "status": "Success",
        "message": "Lead Logs Updated Successfully",
        "type": "Success"
    },
    FAILURE_SHOWMYLEADS: {
        "statusCode": "404",
        "status": "Failure",
        "message": "Leads Not Found",
        "type": "Bad Request"
    },
    FAILURE_EDITLEAD: {
        "statusCode": "404",
        "status": "Failure",
        "message": "Lead Not Found",
        "type": "Bad Request"
    },
    FAILURE_LEADLOGS: {
        "statusCode": "404",
        "status": "Failure",
        "message": "Lead Not Found",
        "type": "Bad Request"
    },
    FAILURE_VIEWLEADDETAILS: {
        "statusCode": "404",
        "status": "Failure",
        "message": "Leads Not Found",
        "type": "Bad Request"
    },
    PROPERTY_ALREADY_EXISTS: {
        "statusCode": "404",
        "status": "Failure",
        "message": "Property already exists!! Please update",
        "type": "Bad Request"
    }


};