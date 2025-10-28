import React, { useState, useRef, useEffect } from "react";
import { IoChevronDown, IoClose } from "react-icons/io5";
import type { AccessInfo, IUser } from "@agensy/types";
import { ROLE_MAP, ROLES } from "@agensy/constants";

interface MultiSelectParticipantProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  options: (AccessInfo | IUser)[];
  allowClear?: boolean;
  disabled?: boolean;
  className?: string;
  clientId?: string;
  accessUsers?: IUser[];
  userData?: IUser;
}

interface SelectOption {
  id: string;
  label: string;
  value: string;
  type: "user" | "all_caregivers" | "all_family";
  role?: "family_member" | "caregiver" | "primary_user" | "admin";
  disabled?: boolean;
}

export const MultiSelectParticipant: React.FC<MultiSelectParticipantProps> = ({
  value = [],
  onChange,
  placeholder = "Start typing names...",
  options = [],
  allowClear = false,
  disabled = false,
  className = "",
  clientId,
  accessUsers = [],
  userData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const getUserRoleForClient = (
    user: AccessInfo | IUser
  ): string | undefined => {
    if (!("UserRoles" in user) || !user.UserRoles) return undefined;

    if (!Array.isArray(user.UserRoles)) {
      return user.UserRoles.role;
    }

    const clientRole = user.UserRoles.find(
      (role) => role.client_id === clientId
    );
    return clientRole ? clientRole.role : undefined;
  };

  const isUserAdmin = (): boolean => {
    if (!userData?.Roles) return false;
    return userData.Roles.some((role) => role.role === ROLES.ADMIN);
  };

  const getFamilyAdminClientIds = (): string[] => {
    if (!userData?.Roles) return [];
    return userData.Roles.filter(
      (role) => role.role === ROLES.PRIMARY_USER
    ).map((role) => role.client_id);
  };

  const getCaregiverIds = (): string[] => {
    const familyAdminClientIds = getFamilyAdminClientIds();

    if (!clientId) {
      return accessUsers
        .filter((user) =>
          user.UserRoles?.some(
            (userRole) =>
              familyAdminClientIds.includes(userRole.client_id) &&
              userRole.role === ROLES.CAREGIVER
          )
        )
        .map((user) => user.id as string);
    } else {
      if (!familyAdminClientIds.includes(clientId)) {
        return [];
      }
      return accessUsers
        .filter((user) =>
          user.UserRoles?.some(
            (userRole) =>
              userRole.client_id === clientId &&
              userRole.role === ROLES.CAREGIVER
          )
        )
        .map((user) => user.id as string);
    }
  };

  const getFamilyIds = (): string[] => {
    const familyAdminClientIds = getFamilyAdminClientIds();

    if (!clientId) {
      return accessUsers
        .filter((user) =>
          user.UserRoles?.some(
            (userRole) =>
              familyAdminClientIds.includes(userRole.client_id) &&
              userRole.role === ROLES.FAMILY_MEMBER
          )
        )
        .map((user) => user.id as string);
    } else {
      if (!familyAdminClientIds.includes(clientId)) {
        return [];
      }
      return accessUsers
        .filter((user) =>
          user.UserRoles?.some(
            (userRole) =>
              userRole.client_id === clientId &&
              userRole.role === ROLES.FAMILY_MEMBER
          )
        )
        .map((user) => user.id as string);
    }
  };

  const isAllCaregiversSelected = (): boolean => {
    const caregiverIds = getCaregiverIds();
    return (
      caregiverIds.length > 0 && caregiverIds.every((id) => value.includes(id))
    );
  };

  const isAllFamilySelected = (): boolean => {
    const familyIds = getFamilyIds();
    return familyIds.length > 0 && familyIds.every((id) => value.includes(id));
  };

  const specialOptions: SelectOption[] = [
    {
      id: "all_caregivers",
      label: "Caregivers",
      value: "all_caregivers",
      type: "all_caregivers",
    },
    {
      id: "all_family",
      label: "Family Members",
      value: "all_family",
      type: "all_family",
    },
  ];

  const userOptions: SelectOption[] = options.map((user) => {
    const familyAdminClientIds = getFamilyAdminClientIds();
    let isDisabled = false;

    if (clientId) {
      if (!isUserAdmin()) {
        if (!user.UserRoles || !Array.isArray(user.UserRoles)) {
          isDisabled = true;
        } else {
          const userHasAccessToClient = user.UserRoles.some(
            (userRole: { client_id: string; role: string }) =>
              userRole.client_id === clientId
          );

          if (!userHasAccessToClient) {
            isDisabled = true;
          } else {
            const isFamilyAdminForClient =
              familyAdminClientIds.includes(clientId);
            if (!isFamilyAdminForClient && value.length > 0) {
              isDisabled = !value.includes(user.id as string);
            }
          }
        }
      }
    } else if (value.length > 0) {
      if (!isUserAdmin()) {
        const hasNonFamilyAdminUser = value.some((selectedUserId) => {
          const selectedUser = options.find((opt) => opt.id === selectedUserId);
          if (
            !selectedUser?.UserRoles ||
            !Array.isArray(selectedUser.UserRoles)
          ) {
            return true; // User has no roles, consider them as non-family-admin
          }
          return !selectedUser.UserRoles.some(
            (userRole: { client_id: string; role: string }) =>
              familyAdminClientIds.includes(userRole.client_id)
          );
        });

        if (hasNonFamilyAdminUser) {
          isDisabled = !value.includes(user.id as string);
        } else {
          if (!user.UserRoles || !Array.isArray(user.UserRoles)) {
            isDisabled = true;
          } else {
            isDisabled = !user.UserRoles.some(
              (userRole: { client_id: string; role: string }) =>
                familyAdminClientIds.includes(userRole.client_id)
            );
          }
        }
      }
    }

    return {
      id: user.id as string,
      label: `${user.first_name} ${user.last_name}`,
      value: user.id as string,
      type: "user" as const,
      role: getUserRoleForClient(user) as
        | "family_member"
        | "caregiver"
        | "primary_user"
        | "admin"
        | undefined,
      disabled: isDisabled,
    };
  });

  const selectOptions: SelectOption[] = [...specialOptions, ...userOptions];

  const filteredUserOptions = userOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = selectOptions.filter(
    (option) => value.includes(option.value) && option.type === "user"
  );

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) {
      return;
    }

    if (option.type === "all_caregivers") {
      const caregiverIds = getCaregiverIds();
      const allCaregiversSelected = isAllCaregiversSelected();

      console.log("Caregiver deselection:", {
        caregiverIds,
        allCaregiversSelected,
        currentValue: value,
        clientId,
      });

      if (allCaregiversSelected) {
        const allFamilySelected = isAllFamilySelected();

        if (allFamilySelected) {
          const familyIds = getFamilyIds();
          const caregiverOnlyIds = caregiverIds.filter(
            (id) => !familyIds.includes(id)
          );
          const newValue = value.filter((id) => !caregiverOnlyIds.includes(id));
          console.log(
            "Both groups selected - removing caregiver-only users:",
            newValue
          );
          onChange?.(newValue);
        } else {
          const newValue = value.filter((id) => !caregiverIds.includes(id));
          console.log(
            "Only caregivers selected - removing all caregivers:",
            newValue
          );
          onChange?.(newValue);
        }
      } else {
        const newValue = [...new Set([...value, ...caregiverIds])];
        console.log("New value after adding caregivers:", newValue);
        onChange?.(newValue);
      }
    } else if (option.type === "all_family") {
      const familyIds = getFamilyIds();
      const allFamilySelected = isAllFamilySelected();

      if (allFamilySelected) {
        const allCaregiversSelected = isAllCaregiversSelected();

        if (allCaregiversSelected) {
          const caregiverIds = getCaregiverIds();
          const familyOnlyIds = familyIds.filter(
            (id) => !caregiverIds.includes(id)
          );
          const newValue = value.filter((id) => !familyOnlyIds.includes(id));
          console.log(
            "Both groups selected - removing family-only users:",
            newValue
          );
          onChange?.(newValue);
        } else {
          const newValue = value.filter((id) => !familyIds.includes(id));
          console.log("Only family selected - removing all family:", newValue);
          onChange?.(newValue);
        }
      } else {
        const newValue = [...new Set([...value, ...familyIds])];
        console.log("New value after adding family:", newValue);
        onChange?.(newValue);
      }
    } else {
      const newValue = value.includes(option.value)
        ? value.filter((v) => v !== option.value)
        : [...value, option.value];
      onChange?.(newValue);
    }
    setSearchTerm("");
  };

  const handleRemove = (optionValue: string) => {
    const newValue = value.filter((v) => v !== optionValue);
    onChange?.(newValue);
  };

  const handleClear = () => {
    onChange?.([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < filteredUserOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredUserOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredUserOptions.length) {
          handleSelect(filteredUserOptions[focusedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const focusedItem = listRef.current.children[focusedIndex] as HTMLElement;
      if (focusedItem) {
        focusedItem.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [focusedIndex]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className={`
          relative flex flex-wrap items-center gap-1 min-h-[42px] px-2 py-0
          border border-gray-300 rounded-[0.7rem] bg-[#f5f7fa]
          ${disabled ? "bg-gray-50 cursor-not-allowed" : "cursor-text"}
          ${
            isOpen
              ? "border-[#4285f4] shadow-[0_0_8px_rgba(66,133,244,0.15)]"
              : ""
          }
          hover:border-gray-400 focus-within:border-[#4285f4] focus-within:shadow-[0_0_8px_rgba(66,133,244,0.15)] transition-all duration-300
          text-[#333333] text-sm font-normal
        `}
        onClick={(e) => {
          if (!disabled && e.target === e.currentTarget) {
            setIsOpen(!isOpen);
          }
        }}
      >
        {selectedOptions.map((option) => (
          <div
            key={option.id}
            className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs">{option.label}</span>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(option.value);
                }}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <IoClose className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          onClick={(e) => e.stopPropagation()}
          placeholder={selectedOptions.length === 0 ? placeholder : ""}
          disabled={disabled}
          className="flex-1 min-w-[120px] outline-none bg-transparent text-[#333333] placeholder:text-[#333333] placeholder:font-normal text-sm font-normal"
        />

        {allowClear && value.length > 0 && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <IoClose className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="text-[#6b7280] hover:text-gray-600 p-1 pt-0.5"
        >
          <IoChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`fixed z-[9999] w-full border border-gray-200 rounded-[0.5rem] shadow-[0_0_15px_rgba(0,0,0,0.1)] max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500 p-1 transition-all duration-300 ease-out ${
          isOpen
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform -translate-y-2 pointer-events-none"
        }`}
        style={{
          backgroundColor: "#F5F7FA",
          top: dropdownRef.current
            ? dropdownRef.current.getBoundingClientRect().bottom +
              window.scrollY +
              4
            : 0,
          left: dropdownRef.current
            ? dropdownRef.current.getBoundingClientRect().left + window.scrollX
            : 0,
          width: dropdownRef.current
            ? dropdownRef.current.getBoundingClientRect().width
            : "auto",
        }}
      >
        <div ref={listRef}>
          {/* Special Options Section */}
          <div className="px-3 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-row gap-3">
              {specialOptions.map((option) => {
                let isSelected = false;

                if (option.type === "all_caregivers") {
                  isSelected = isAllCaregiversSelected();
                } else if (option.type === "all_family") {
                  isSelected = isAllFamilySelected();
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`
                      flex items-center gap-2 px-4 py-2 cursor-pointer text-sm
                      rounded-lg border transition-all duration-200 flex-1
                      ${
                        isSelected
                          ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                      }
                    `}
                    onClick={() => handleSelect(option)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Regular User Options Section */}
          {filteredUserOptions.length === 0 ? (
            <div className="px-3 py-3 text-[#333333] text-sm text-center">
              No options found
            </div>
          ) : (
            filteredUserOptions.map((option, index) => {
              const isSelected = value.includes(option.value);
              const isFocused = index === focusedIndex;

              return (
                <div
                  key={option.id}
                  className={`
                      px-3 py-2 text-sm flex items-center justify-between
                      rounded-[0.375rem] my-0.5 transition-all duration-200
                      ${
                        option.disabled
                          ? "cursor-not-allowed opacity-50 text-gray-400"
                          : "cursor-pointer"
                      }
                      ${isFocused && !option.disabled ? "bg-[#f3f4f6]" : ""}
                      ${
                        isSelected && !option.disabled
                          ? "bg-[#f3f4f6] text-[#333333] font-medium"
                          : option.disabled
                          ? "text-gray-400"
                          : "text-[#333333]"
                      }
                      ${!option.disabled ? "hover:bg-[#f3f4f6]" : ""}
                    `}
                  onClick={() => !option.disabled && handleSelect(option)}
                  onMouseEnter={() =>
                    !option.disabled && setFocusedIndex(index)
                  }
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      disabled={option.disabled}
                      className={`w-4 h-4 ${
                        option.disabled ? "accent-gray-300" : "accent-[#4285f4]"
                      }`}
                    />
                    <span>{option.label}</span>
                    {option.role && (
                      <span
                        className={`text-xs capitalize ${
                          option.disabled ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        (
                        {ROLE_MAP[option.role] || option.role.replace("_", " ")}
                        )
                      </span>
                    )}
                    {option.disabled && (
                      <span className="text-xs text-gray-400 ml-auto">
                        {clientId
                          ? "Not available for this client"
                          : value.length > 0 &&
                            value.some((selectedUserId) => {
                              const selectedUser = options.find(
                                (opt) => opt.id === selectedUserId
                              );
                              if (
                                !selectedUser?.UserRoles ||
                                !Array.isArray(selectedUser.UserRoles)
                              ) {
                                return true;
                              }
                              const familyAdminClientIds =
                                getFamilyAdminClientIds();
                              return !selectedUser.UserRoles.some(
                                (userRole: {
                                  client_id: string;
                                  role: string;
                                }) =>
                                  familyAdminClientIds.includes(
                                    userRole.client_id
                                  )
                              );
                            })
                          ? "Cannot add more users"
                          : "Not available for group messaging"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiSelectParticipant;
