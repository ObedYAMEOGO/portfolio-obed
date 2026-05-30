# backend/app/utils/reading_time.py

"""
Utility functions for calculating reading time from text content.
"""

def calculate_reading_time(content: str, words_per_minute: int = 200) -> int:
    """
    Calculate reading time in minutes based on word count.
    
    Args:
        content: The text content to calculate reading time for
        words_per_minute: Average reading speed (default 200 WPM)
    
    Returns:
        int: Reading time in minutes (minimum 1 minute)
    
    Example:
        >>> calculate_reading_time("Hello world. This is a test.", 200)
        1
        >>> calculate_reading_time("word " * 400, 200)  # 400 words
        2
    """
    if not content or not content.strip():
        return 1
    
    # Count words (split by whitespace)
    words = len(content.split())
    
    # Calculate minutes, ensure minimum 1 minute
    minutes = max(1, round(words / words_per_minute))
    
    return minutes


def estimate_word_count(content: str) -> int:
    """
    Estimate the number of words in the content.
    
    Args:
        content: The text content
    
    Returns:
        int: Estimated word count
    """
    if not content:
        return 0
    return len(content.split())


def get_reading_time_range(content: str) -> dict:
    """
    Get reading time range for different reading speeds.
    
    Args:
        content: The text content
    
    Returns:
        dict: Reading times for slow, average, and fast readers
    """
    word_count = estimate_word_count(content)
    
    return {
        "slow": max(1, round(word_count / 150)),   # 150 WPM (slow readers)
        "average": max(1, round(word_count / 200)), # 200 WPM (average)
        "fast": max(1, round(word_count / 300)),    # 300 WPM (fast readers)
    }