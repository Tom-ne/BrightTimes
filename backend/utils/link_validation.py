import re

def is_valid_link(link: str) -> bool:
    # General URL validation
    general_pattern = re.compile(
        r'^(https?:\/\/)'              # http:// or https://
        r'([\w\-]+\.)+[a-zA-Z]{2,}'    # domain name
        r'(\/[\w\-._~:/?#[\]@!$&\'()*+,;=]*)?$'  # optional path/query/fragment
    )
    
    # Platform restriction: only allow Zoom or Google Meet
    allowed_platform_pattern = re.compile(
        r'^https:\/\/(zoom\.us|meet\.google\.com)\/'
    )
    
    return bool(general_pattern.match(link)) and bool(allowed_platform_pattern.match(link))
