from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        errors = response.data
        response.data = {
            "status_code": response.status_code,
            "error": errors,
        }

    return response