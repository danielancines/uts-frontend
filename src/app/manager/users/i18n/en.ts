export const locale = {
    lang: 'en',
    data: {
        'USERS_MAIN': {
            'NAME': 'Name',
            'DESCRIPTION': 'Description',
            'LAST_NAME': 'Last Name',
            'EMAIL': 'Email',
            'GROUPS': 'Groups',
            'SITUATION': 'Situation',
            'ACTIVE': 'Active',
            'NOT_ACTIVE': 'Not Active',
            'CAN_INFORM_VALUE_AT_MONEY_REQUEST': 'Insert value to Money Request',
            'MONEY_REQUEST_VALUE_YES': 'Yes',
            'MONEY_REQUEST_VALUE_NO': 'No',
            'NICK': 'Nick',
            'FULL_NAME': 'Full Name',
            'MORE_INFORMATION': 'More Info',
            'INSERT_MESSAGES': {
                'SUCCESS': 'User inserted!',
                'ERROR': 'An error occurred at user creation'
            },
            'UPDATE_MESSAGES': {
                'SUCCESS': 'User updated!',
                'ERROR': 'An error occurred at user update',
                'CHANGING_PASSWORD': 'Changing password and sending email...',
                'RESET_PASSWORD': {
                    'MESSAGE': 'Password will be reset, do you confirm?',
                    'TITLE': 'Reset confirmation',
                    'CONFIRM_BUTTON_TEXT': 'Yes',
                    'CANCEL_BUTTON_TEXT': 'No',
                    'FINISHED_RESET': 'Password changed, user will receive an email with the new password.'
                },
                'CHANGE_STATUS': {
                    'ACTIVATE': {
                        'TITLE': 'User activated',
                        'MESSAGE': 'User will be able to access the system',
                        'ERROR': 'User cannot be activated'
                    },
                    'DEACTIVATE': {
                        'TITLE': 'User deactivated',
                        'MESSAGE': 'User cannot access the system so far',
                        'ERROR': 'User cannot be deactivated'
                    }
                }
            },
            'DELETE_MESSAGES': {
                'SUCCESS': 'User deleted!',
                'ERROR': 'An error occurred at user delete'
            }
        },
        'USERS_REGISTRY': {
            'NAME': 'Name',
            'LAST_NAME': 'Last Name',
            'EMAIL': 'Email',
            'GROUPS': 'Groups',
            'PASSWORD': 'Password',
            'ROLES': 'Roles',
            'DELETE': 'DELETE',
            'ADD': 'INSERT',
            'SAVE': 'SAVE',
            'TITLE': 'Users',
            'FULL_NAME': 'Full Name',
            'NICK_NAME': 'Nick Name',
            'RESET_PASSWORD': 'Reset Password',
            'BASIC_INFORMATION': 'Basic Informations',
            'ADDITIONAL_INFORMATION': 'Additional Informations',
            'ACCESS_PERMISSIONS': 'Groups and Accesses',
            'SITUATION': 'Situation',
            'ACCESS': 'System Access',
            'RG': 'Personal ID',
            'CPF': 'Document Number',
            'PHONE': 'Phone',
            'ZIPCODE': 'Zipcode',
            'STREET_NAME': 'Street',
            'ADDRESS_NUMBER': 'Number',
            'CITY_NAME': 'City',
            'STATE': 'State',
            'DEAL_PERCENTAGE': 'Deal percentage',
            'POKER_ROOMS': 'Poker Rooms',
            'MORE_INFORMATION': 'More Information',
            'ADDRESS_COMPLEMENT': 'Complement',
            'ERRORS': {
                'NAME_REQUIRED': 'Name required',
                'LAST_NAME_REQUIRED': 'Last Name required',
                'EMAIL_REQUIRED': 'Email required',
                'EMAIL_VALIDATOR': 'Email format invalid',
                'PASSWORD_REQUIRED': 'Password required',
                'RG_REQUIRED': 'Personal ID required',
                'RG_PATTERN': 'Only numbers are allowed',
                'CPF_REQUIRED': 'Document Number Required',
                'CPF_PATTERN': 'Only numbers are allowed',
                'PHONE_REQUIRED': 'Phone required',
                'PHONE_PATTERN': 'Only numbers are allowed',
                'ZIPCODE_REQUIRED': 'Zipcode required',
                'ZIPCODE_PATTERN': 'Only numbers are allowed',
                'STREET_NAME_REQUIRED': 'Street required',
                'CITY_NAME_REQUIRED': 'City required',
                'STATE_REQUIRED': 'State required',
                'ADDREES_NUMBER': 'Number required',
                'DEAL_PERCENTAGE_REQUIRED': 'Deal percentage required',
                'DEAL_PERCENTAGE_MAX': 'Deal percentage cannot be more than 100%',
                'DEAL_PERCENTAGE_PATTERN': 'Deal must be a positive number',
                'ADDRESS_NUMBER_PATTERN': 'Address number must be a positive number',
                'ADDRESS_NUMBER_REQUIRED': 'Address number required',
                'FORM_INVALID': 'Incorrect informations on fields or blank values!'
            }
        },
        'USERS_ERRORS': {
            'EMAIL_ALREADY_EXISTS': {
                'MESSAGE': 'This email already exists.',
                'TITLE': 'Insert Users'
            },
            'INSERT_USER': {
                'MESSAGE': 'You dont have permission to add Users',
                'TITLE': 'Insert Users'
            },
            'UPDATE_USER': {
                'MESSAGE': 'You dont have permission to update Users',
                'TITLE': 'Update Users'
            },
            'DELETE_USER': {
                'MESSAGE': 'You dont have permission to delete User',
                'TITLE': 'Delete Users'
            },
            'ACCESS_USER': {
                'MESSAGE': 'You dont have permission to access Users registry',
                'TITLE': 'Access Users'
            }
        }
    }
};
